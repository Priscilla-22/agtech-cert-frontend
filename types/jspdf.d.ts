declare module 'jspdf' {
  export class jsPDF {
    constructor()
    internal: {
      pageSize: {
        getWidth(): number
        getHeight(): number
      }
    }
    setFontSize(size: number): void
    setTextColor(r: number, g: number, b: number): void
    text(text: string, x: number, y: number, options?: { align?: string }): void
    save(filename: string): void
    autoTable(options: any): void
  }
}

declare module 'jspdf-autotable' {
  // This will extend jsPDF
}

declare module 'xlsx' {
  export const utils: {
    book_new(): any
    json_to_sheet(data: any[]): any
    book_append_sheet(wb: any, ws: any, name: string): void
  }
  export function writeFile(wb: any, filename: string): void
}