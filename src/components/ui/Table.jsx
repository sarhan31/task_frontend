import { cn } from '@utils/cn';

const Table = ({ children, className }) => {
  return (
    <div className="w-full max-w-full overflow-x-auto rounded-2xl border border-[#ead8cb] bg-white/80 backdrop-blur-sm shadow-soft custom-scrollbar">
      <table className={cn('w-full min-w-max border-collapse text-left text-sm', className)}>
        {children}
      </table>
    </div>
  );
};

const TableHeader = ({ children, className }) => {
  return (
    <thead className={cn('bg-[#fffaf6] border-b border-[#f4ddd0]', className)}>
      {children}
    </thead>
  );
};

const TableBody = ({ children, className }) => {
  return (
    <tbody className={cn('divide-y divide-[#f4ddd0] bg-white/40', className)}>
      {children}
    </tbody>
  );
};

const TableRow = ({ children, className, hover = true }) => {
  return (
    <tr
      className={cn(
        'transition-colors duration-150',
        hover && 'hover:bg-[#fffaf6]/70',
        className
      )}
    >
      {children}
    </tr>
  );
};

const TableHead = ({ children, className }) => {
  return (
    <th
      className={cn(
        'whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400 font-display sm:px-4 lg:px-6 lg:py-4 lg:tracking-[0.16em]',
        className
      )}
    >
      {children}
    </th>
  );
};

const TableCell = ({ children, className }) => {
  return (
    <td className={cn('px-3 py-3 text-slate-700 font-medium sm:px-4 lg:px-6 lg:py-4', className)}>
      {children}
    </td>
  );
};

Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Head = TableHead;
Table.Cell = TableCell;

export default Table;
