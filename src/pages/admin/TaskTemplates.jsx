import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Plus, Rocket, Save, Trash2 } from 'lucide-react';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import Select from '@components/ui/Select';
import Textarea from '@components/ui/Textarea';
import { toast } from '@components/ui/Toaster';
import { useTaskStore } from '@services/taskStore';

const STORAGE_KEY = 'task_suite_templates';

const seedTemplates = [
  {
    id: 'template-design-review',
    name: 'Design Review',
    title: 'Review UI screens and provide feedback',
    description: 'Check layout, responsiveness, visual hierarchy, and user flow. Attach notes or screenshots when needed.',
    priority: 'medium',
    tags: ['design', 'review'],
  },
  {
    id: 'template-release-checklist',
    name: 'Release Checklist',
    title: 'Complete release readiness checklist',
    description: 'Verify build, smoke test core workflows, confirm reports, and document any release blockers.',
    priority: 'high',
    tags: ['release', 'qa'],
  },
];

const loadTemplates = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    return Array.isArray(stored) && stored.length ? stored : seedTemplates;
  } catch {
    return seedTemplates;
  }
};

const saveTemplates = (templates) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
};

const blankForm = {
  name: '',
  title: '',
  description: '',
  priority: 'medium',
  tags: '',
};

const nextWeek = () => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString().split('T')[0];
};

const TaskTemplates = () => {
  const addTask = useTaskStore((state) => state.addTask);
  const [templates, setTemplates] = useState(loadTemplates);
  const [form, setForm] = useState(blankForm);

  const canSave = useMemo(() => form.name.trim() && form.title.trim(), [form]);

  const persist = (nextTemplates) => {
    setTemplates(nextTemplates);
    saveTemplates(nextTemplates);
  };

  const handleSave = () => {
    if (!canSave) {
      toast.error('Template name and task title are required.');
      return;
    }

    const nextTemplate = {
      id: `template-${Date.now()}`,
      ...form,
      tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
    };
    persist([nextTemplate, ...templates]);
    setForm(blankForm);
    toast.success('Task template saved.');
  };

  const handleDelete = (id) => {
    persist(templates.filter((template) => template.id !== id));
    toast.success('Template removed.');
  };

  const handleCreateTask = async (template) => {
    await addTask({
      title: template.title,
      description: template.description,
      priority: template.priority,
      dueDate: nextWeek(),
      tags: template.tags || [],
      status: 'Assigned',
    });
    toast.success(`Task created from "${template.name}".`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <div>
        <h1 className="font-display text-3xl font-bold text-slate-900">Task Templates</h1>
        <p className="mt-1 text-sm text-slate-500">Create reusable task starters for repeated operational work.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <section className="rounded-[26px] border border-[#ead8cb] bg-white/82 p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <Plus className="h-5 w-5 text-[#13856f]" />
            <h2 className="text-sm font-bold text-slate-800">New Template</h2>
          </div>

          <div className="space-y-4">
            <Input label="Template Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. QA Sweep" />
            <Input label="Task Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Reusable task title" />
            <Textarea label="Description" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Default instructions and acceptance criteria" />
            <Select
              label="Default Priority"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'urgent', label: 'Urgent' },
              ]}
            />
            <Input label="Tags" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="release, qa, frontend" />
            <Button type="button" onClick={handleSave} className="w-full bg-[#13856f] text-white hover:bg-[#0f7260]">
              <Save className="mr-2 h-4 w-4" />
              Save Template
            </Button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {templates.map((template) => (
            <article key={template.id} className="flex min-h-[260px] flex-col rounded-[26px] border border-[#ead8cb] bg-white/85 p-5 shadow-sm">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e8f6f2] text-[#13856f]">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-800">{template.name}</h2>
                    <p className="text-xs font-semibold capitalize text-slate-400">{template.priority} priority</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(template.id)} className="rounded-xl p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <h3 className="text-sm font-bold leading-5 text-slate-800">{template.title}</h3>
              <p className="mt-2 line-clamp-4 text-sm leading-6 text-slate-500">{template.description || 'No default description.'}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {(template.tags || []).map((tag) => (
                  <span key={tag} className="rounded-full border border-[#ead8cb] bg-[#fffaf6] px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                    {tag}
                  </span>
                ))}
              </div>

              <Button type="button" onClick={() => handleCreateTask(template)} className="mt-auto bg-[#13856f] text-white hover:bg-[#0f7260]">
                <Rocket className="mr-2 h-4 w-4" />
                Create Task
              </Button>
            </article>
          ))}
        </section>
      </div>
    </motion.div>
  );
};

export default TaskTemplates;
