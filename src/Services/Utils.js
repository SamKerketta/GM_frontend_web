import moment from "moment";
import ErrorToast from "../components/ErrorToast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export function isNullOrEmpty(str) {
  return str === null || str === undefined || str.trim() === '';
}

export function dmyToYmd(dateStr){
    if(dateStr){
        const [day, month, year] = dateStr.split("-");
        return `${year}-${month}-${day}`; // "2025-05-26"
    }
}

// 
export function getEndingDateByPlanId(membershipStart,planId,duration){
    if (membershipStart && planId) {
      const addMonths = duration; // Do here dynamication as per plan
      const start = new Date(membershipStart);
      const laterDate = new Date(
        start.setMonth(start.getMonth() + Number(addMonths))
      );
      return laterDate.toISOString().split("T")[0];
    }
}

// 
export function getDateInLongFormat(){
  const date = new Date();
  const formattedDate=date.toLocaleDateString("en-US",{
      year:"numeric",
      month:"long",
      day:"numeric"
});
return formattedDate;
}

export function dmyToLongForm(date){
  var formattedDate = date;
  if(date){
    formattedDate = moment(date,"DD-MM-YYYY").format("DD MMM, YYYY");
  }
  return formattedDate;
}

export function handleValidation(errors){
  const apiErrors = errors;
  // Loop through all error messages and show toasts
  Object.keys(apiErrors).forEach((field) => {
    apiErrors[field].forEach((msg) => ErrorToast.show(msg));
  });
}


export async function downloadInvoicePdf(invoiceRef,receiptDtls) {
    const pdf = new jsPDF("p", "pt", "a4");

    const margin = 20; // ← custom margin in points

    const pageWidth = pdf.internal.pageSize.getWidth() - margin * 2;
    const pageHeight = pdf.internal.pageSize.getHeight() - margin * 2;

    const canvas = await html2canvas(invoiceRef.current, {
      scale: 1,
      useCORS: true,
      backgroundColor: "#fff", // white background
    });

    const imageData = canvas.toDataURL("image/png");

    // original canvas size
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // scale image to fit within the page (minus margins)
    const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
    const imgScaledWidth = imgWidth * ratio;
    const imgScaledHeight = imgHeight * ratio;

    // insert image with margin
    pdf.addImage(
      imageData,
      "PNG",
      margin,
      margin,
      imgScaledWidth,
      imgScaledHeight
    );

    const pdfName = receiptDtls?.invoice_no ?? "invoice";
    pdf.save(`${pdfName}.pdf`);
}

export async function printInvoice(invoiceRef){
  const content = invoiceRef.current;
    if (!content) return;

    const printWindow = window.open("", "_blank", "width=800,height=600");

    printWindow.document.write(`
    <html>
      <head>
        <title>Invoice</title>
        <!-- TailwindCSS or your custom stylesheets -->
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <style>
          @media print {
            body {
              margin: 0;
              padding: 1rem;
            }
            .no-print {
               display: none;
            }

            .size-on-print{
              display:none;
            }
          }
        </style>
      </head>
      <body class="bg-white text-black">
        <div class="print-area">
          ${content.innerHTML}
        </div>
      </body>
    </html>
  `);

    printWindow.document.close();
    printWindow.focus();

    // Give time for styles and content to load
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
}