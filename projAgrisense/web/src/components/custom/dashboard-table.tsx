import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";

type CellValue = {
  value: string | number;
  color?: string;
};

type TableRowData = Record<string, string | number | CellValue>;

type ColumnDef = {
  key: string;
};

type DashboardTableProps = {
  columns: ColumnDef[];
  rows: TableRowData[];
};

function resolveCell(raw: string | number | CellValue): {
  display: string | number;
  color?: string;
} {
  if (raw !== null && typeof raw === "object" && "value" in raw) {
    return { display: raw.value, color: raw.color };
  }
  return { display: raw as string | number };
}

export function DashboardTable({ columns, rows }: DashboardTableProps) {
  return (
    <Card className="overflow-hidden p-0">
      <Table>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex} className="border-b last:border-b-0">
              {columns.map((col, colIndex) => {
                const { display, color } = resolveCell(row[col.key]);
                return (
                  <TableCell
                    key={col.key}
                    className={`px-10.5 py-3.75 ${colIndex === 0 ? "border-r font-semibold text-[18px]" : "font-bold text-[18px]"} `}
                    style={color ? { color } : undefined}
                  >
                    {display}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
