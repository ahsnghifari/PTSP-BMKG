import { toast } from "react-hot-toast";
import jsPDF from "jspdf";
import "jspdf-autotable";

const useInvoicePDF = () => {
  const generateInvoicePDF = (pemesanan, userData, ajukanDetail) => {
    try {
      const doc = new jsPDF();

      const imageUrl = "/assets/img/Faktur-Header.png";
      const imgWidth = 210;
      const imgHeight = 40;
      doc.addImage(imageUrl, "JPEG", 0, 0, imgWidth, imgHeight);

      const title = "Dokumen Pesanan Anda";
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      const pageWidth = doc.internal.pageSize.width;
      const titleX = (pageWidth - doc.getTextWidth(title)) / 2;
      doc.text(title, titleX, imgHeight + 15);

      const statusMapping = {
        "Menunggu Pembayaran": { label: "Belum Bayar", color: [255, 0, 0] },
        Ditolak: { label: "Ditolak", color: [255, 0, 0] },
        "Sedang Ditinjau": { label: "Sedang Ditinjau", color: [255, 255, 0] },
        Lunas: { label: "Lunas", color: [0, 128, 0] },
      };

      const statusData = statusMapping[pemesanan.Status_Pembayaran] || {
        label: "Status Tidak Diketahui",
        color: [128, 128, 128],
      };

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(...statusData.color);
      const statusX = pageWidth - doc.getTextWidth(statusData.label) - 14;
      doc.text(statusData.label, statusX, imgHeight + 30);

      doc.setTextColor(0, 0, 0);

      const billingDetails = [
        { label: "Nomor Pesanan", value: `#${pemesanan.id}` },
        { label: "Nomor Ajukan", value: pemesanan.ID_Ajukan },
        {
          label: "Tanggal Pemesanan",
          value: new Date(
            pemesanan.Tanggal_Pemesanan.seconds * 1000
          ).toLocaleString(),
        },
        {
          label: "Tanggal Pengajuan",
          value: new Date(
            ajukanDetail.Tanggal_Pembuatan_Ajukan.seconds * 1000
          ).toLocaleString(),
        },
        {
          label: "Detail Penerima",
          value: userData.Nama_Perusahaan
            ? `${userData.Nama_Lengkap} || ${userData.Nama_Perusahaan}`
            : userData.Nama_Lengkap,
        },
        {
          label: "Email",
          value: userData.Email_Perusahaan
            ? `${userData.Email} || ${userData.Email_Perusahaan}`
            : userData.Email,
        },
        {
          label: "Tanggal Pembayaran",
          value:
            pemesanan.ajukanDetail?.Jenis_Ajukan === "Gratis"
              ? "GRATIS"
              : pemesanan.Status_Pembayaran === "Sedang Ditinjau"
              ? "Pembayaran sedang ditinjau"
              : pemesanan.Status_Pembayaran === "Ditolak"
              ? "Pembayaran Anda Ditolak"
              : pemesanan.transaksiDetail?.Tanggal_Pengiriman_Bukti
              ? new Date(
                  pemesanan.transaksiDetail.Tanggal_Pengiriman_Bukti.seconds *
                    1000
                ).toLocaleString()
              : "-",
        },
      ];

      let billingY = imgHeight + 40;
      billingDetails.forEach((item) => {
        doc.setFont("helvetica", "normal");
        doc.text(`${item.label}: ${item.value}`, 14, billingY);
        billingY += 8;
      });

      doc.autoTable({
        head: [
          [
            "Nama Produk",
            "Nama Instansi",
            "Kuantitas",
            "Harga Produk",
            "Total Harga per Produk",
          ],
        ],
        body: pemesanan.Data_Keranjang.map((produk) => [
          produk.Nama,
          produk.Pemilik,
          produk.Kuantitas,
          new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
          }).format(produk.Harga),
          new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
          }).format(produk.Harga * produk.Kuantitas),
        ]),
        startY: billingY + 10,
      });

      const totalPrice = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(pemesanan.Total_Harga_Pesanan);

      const totalY = doc.lastAutoTable.finalY + 10;
      doc.setFont("helvetica", "bold");
      doc.text("Total Pesanan", 14, totalY);
      doc.setFont("helvetica", "normal");
      doc.text(`: ${totalPrice}`, 60, totalY);

      const noteText =
        "Catatan: Jika ada permasalahan atau kesalahan dalam dokumen ini, silakan hubungi stasiun sesuai pesanan anda.";
      const noteY = totalY + 10;
      doc.text(doc.splitTextToSize(noteText, pageWidth - 28), 14, noteY);

      doc.save(`Invoice_Pesanan_${pemesanan.id}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Terjadi kesalahan saat membuat PDF.");
    }
  };

  const handleDownload = (pemesanan, userData, ajukanDetail) => {
    if (!pemesanan || !userData || !ajukanDetail) {
      toast.error("Data pesanan tidak lengkap.");
      return;
    }
    generateInvoicePDF(pemesanan, userData, ajukanDetail);
  };

  return { handleDownload };
};

export default useInvoicePDF;
