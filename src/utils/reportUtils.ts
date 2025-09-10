/* Utility functions for exporting reports and calendar sync */

export type ColumnKey = 'natureOfActivity' | 'activity' | 'significance' | 'dueDate' | 'actualDate' | 'status';

export interface TimelineExportRow {
  natureOfActivity: string;
  activity: string;
  significance: number;
  dueDate: string; // ISO date
  actualDate?: string; // ISO date
  status: string;
}

export interface ExportOptions {
  columns: ColumnKey[];
  hiddenColumns: Set<ColumnKey>;
  align: 'left' | 'center' | 'right';
  sortLatestOnTop: boolean;
}

export function sortRows(rows: TimelineExportRow[], latestOnTop: boolean): TimelineExportRow[] {
  const sorted = [...rows].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  return latestOnTop ? sorted.reverse() : sorted;
}

export function applyDateFilter(rows: TimelineExportRow[], start?: string, end?: string): TimelineExportRow[] {
  if (!start && !end) return rows;
  const startTime = start ? new Date(start).getTime() : -Infinity;
  const endTime = end ? new Date(end).getTime() : Infinity;
  return rows.filter(r => {
    const t = new Date(r.dueDate).getTime();
    return t >= startTime && t <= endTime;
  });
}

export function visibleColumns(columns: ColumnKey[], hidden: Set<ColumnKey>): ColumnKey[] {
  return columns.filter(c => !hidden.has(c));
}

export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function toCsv(rows: TimelineExportRow[], columns: ColumnKey[]): string {
  const header = columns.map(c => headerMap[c]).join(',');
  const body = rows.map(r => columns.map(c => csvEscape(valueFor(r, c))).join(',')).join('\n');
  return header + '\n' + body;
}

function csvEscape(v: string | number | undefined): string {
  const s = v === undefined ? '' : String(v);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

const headerMap: Record<ColumnKey, string> = {
  natureOfActivity: 'Nature of Activity',
  activity: 'Activity',
  significance: 'Significance',
  dueDate: 'Due Date',
  actualDate: 'Actual Date',
  status: 'Status',
};

function valueFor(r: TimelineExportRow, c: ColumnKey): string | number {
  switch (c) {
    case 'natureOfActivity': return r.natureOfActivity;
    case 'activity': return r.activity;
    case 'significance': return r.significance;
    case 'dueDate': return formatDate(r.dueDate);
    case 'actualDate': return r.actualDate ? formatDate(r.actualDate) : '';
    case 'status': return statusLabel(r.status);
  }
}

function statusLabel(s: string): string {
  switch (s) {
    case 'due_today': return 'Due Today';
    case 'completed': return 'Completed';
    case 'due_this_week': return 'Due This Week';
    case 'upcoming': return 'Upcoming';
    case 'overdue': return 'Overdue';
    default: return s;
  }
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export function download(filename: string, mime: string, content: BlobPart) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Excel-compatible HTML table (.xls) for richer formatting than CSV without extra deps
export function toExcelHtml(rows: TimelineExportRow[], columns: ColumnKey[], align: 'left' | 'center' | 'right'): string {
  const ths = columns.map(c => `<th style="text-align:${align}; padding:6px; border:1px solid #ccc">${headerMap[c]}</th>`).join('');
  const trs = rows.map(r => {
    const tds = columns.map(c => `<td style="text-align:${align}; padding:6px; border:1px solid #eee">${escapeHtml(String(valueFor(r, c) ?? ''))}</td>`).join('');
    return `<tr>${tds}</tr>`;
  }).join('');
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body><table>${`<thead><tr>${ths}</tr></thead><tbody>${trs}</tbody>`}</table></body></html>`;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Minimal printable HTML for user to Save as PDF via browser dialog
export function openPrintablePdf(rows: TimelineExportRow[], columns: ColumnKey[], align: 'left' | 'center' | 'right', title = 'Timeline Report') {
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${title}</title>
    <style>
      body{font-family: Arial, sans-serif; padding: 24px}
      h1{font-size:18px; margin-bottom:12px}
      table{width:100%; border-collapse:collapse}
      th,td{border:1px solid #ddd; padding:8px; text-align:${align}}
      th{background:#f5f5f5}
    </style>
  </head><body>
  <h1>${title}</h1>
  <table>
    <thead><tr>${columns.map(c => `<th>${headerMap[c]}</th>`).join('')}</tr></thead>
    <tbody>
      ${rows.map(r => `<tr>${columns.map(c => `<td>${escapeHtml(String(valueFor(r, c) ?? ''))}</td>`).join('')}</tr>`).join('')}
    </tbody>
  </table>
  <script>window.onload=()=>window.print();</script>
  </body></html>`;
  const win = window.open('', '_blank');
  if (win) {
    win.document.open();
    win.document.write(html);
    win.document.close();
  }
}

// ICS generation for calendar sync
export function generateICS(rows: TimelineExportRow[], calendarName = 'Timeline Events'): string {
  const lines: string[] = [];
  lines.push('BEGIN:VCALENDAR');
  lines.push('VERSION:2.0');
  lines.push(`X-WR-CALNAME:${escapeICS(calendarName)}`);
  rows.forEach((r, idx) => {
    const dtStart = icsDate(r.dueDate);
    const dtEnd = icsDate(r.dueDate); // all-day single day
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${Date.now()}-${idx}@timeline.local`);
    lines.push(`DTSTAMP:${icsDate(new Date().toISOString())}`);
    lines.push(`DTSTART;VALUE=DATE:${dtStart}`);
    lines.push(`DTEND;VALUE=DATE:${dtEnd}`);
    lines.push(`SUMMARY:${escapeICS(r.activity)} (${escapeICS(r.natureOfActivity)})`);
    lines.push(`DESCRIPTION:${escapeICS('Status: ' + statusLabel(r.status))}`);
    lines.push('END:VEVENT');
  });
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

function icsDate(iso: string): string {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
}

function escapeICS(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
}
