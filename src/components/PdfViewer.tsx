// import { Document, Page } from 'react-pdf'
// import { useState } from 'react'

// interface PdfViewerProps {
//   url: string
// }

// export function PdfViewer({ url }: PdfViewerProps) {
//   const [numPages, setNumPages] = useState<number | null>(null)

//   function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
//     setNumPages(numPages)
//   }

//   return (
//     <div className="pdf-viewer">
//       <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
//         {Array.from(new Array(numPages), (_, index) => (
//           <Page key={`page_${index + 1}`} pageNumber={index + 1} />
//         ))}
//       </Document>
//     </div>
//   )
// }
