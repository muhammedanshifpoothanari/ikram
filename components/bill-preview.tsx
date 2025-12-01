"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Share2, Save } from "lucide-react"

interface BillItem {
  id: string
  description: string
  unit: string // Added unit field
  kg: string // Added kg field
  price: number
}

interface BillPreviewProps {
  invoiceNumber: string
  customerName: string
  items: BillItem[]
  total: number
  onBack: () => void
  onSave?: () => void
}

export function BillPreview({ invoiceNumber, customerName, items, total, onBack, onSave }: BillPreviewProps) {
  const currentDate = new Date()
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const dateDay = currentDate.getDate()
  const dateMonth = currentDate.getMonth() + 1
  const dateYear = currentDate.getFullYear()

  const handlePrint = () => {
    window.print()
  }

  const handleWhatsAppShare = () => {
    const message = `*Invoice #${invoiceNumber}*\n\nDate: ${formattedDate}\nCustomer: ${customerName}\n\nItems:\n${items
      .map(
        (item) =>
          `- ${item.description}${item.unit ? ` (Unit: ${item.unit})` : ""}${item.kg ? ` (${item.kg})` : ""}: ${item.price.toFixed(2)} SR`,
      )
      .join(
        "\n",
      )}\n\n*Total: ${total.toFixed(2)} SR*\n\nFrom: SEHR AL WEQAIAH Est.\nfor Safety Tools and Materials\nMobile: 0536070172`

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Invoice ${invoiceNumber}`,
          text: `Invoice for ${customerName} - Total: ${total.toFixed(2)}`,
        })
      } catch (err) {
        console.log("Share cancelled or failed")
      }
    }
  }

  const emptyRowsCount = items.length < 5 ? 8 : 3

  return (
    <main className="min-h-screen p-4 pb-20 bg-background">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Action Buttons */}
        <div className="flex gap-3 print:hidden flex-wrap">
          <Button
            onClick={onBack}
            variant="outline"
            size="lg"
            className="h-14 gap-2 flex-1 min-w-[120px] bg-transparent"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </Button>
          {onSave && (
            <Button onClick={onSave} size="lg" className="h-14 gap-2 flex-1 min-w-[120px]">
              <Save className="h-5 w-5" />
              Save Bill
            </Button>
          )}
          <Button onClick={handlePrint} variant="secondary" size="lg" className="h-14 gap-2 flex-1 min-w-[120px]">
            <Download className="h-5 w-5" />
            Print
          </Button>
 
          <Button
            onClick={handleWhatsAppShare}
            className="h-14 gap-2 flex-1 min-w-[120px] bg-[#25D366] hover:bg-[#20BD5A]"
          >
            <Share2 className="h-5 w-5" />
            WhatsApp
          </Button>
        </div>

        <Card className="p-8 space-y-4 print:shadow-none  text-black border-none">
          {/* Header Section - Company Info */}
          <div className="space-y-3">
            {/* Company Name and Logo Row */}
            <div className="flex items-start justify-between gap-4">
              {/* Left Side - English */}
              <div className="flex-1 text-left space-y-0.5">
                <h1 className="text-[22px] font-bold text-[#C84B4B] leading-tight">SEHR AL WEQAIAH Est.</h1>
                <p className="text-[15px] text-[#4A5BAE] font-semibold leading-tight">for Safety Tools and Materials</p>
                <p className="text-[15px] text-[#4A5BAE] font-semibold leading-tight">Tabuk - Tima</p>
                <p className="text-[17px] font-bold text-[#4A5BAE] mt-1 leading-tight">Mobile: 0536070172</p>
              </div>

              {/* Center - Flame Logo */}
              <div className="flex-shrink-0 -mt-2">
                <div className="w-24 h-24 flex items-center justify-center">
                  <img
                    src="/images/whatsapp-image-2025-12-01-at-6-35-50-pm-removebg-preview.png"
                    alt="Company Logo"
                    className="w-full h-full object-contain"
                    style={{
                      filter: "brightness(1.1) saturate(1.4)",
                    }}
                  />
                </div>
              </div>

              {/* Right Side - Arabic */}
              <div className="flex-1 text-right space-y-0.5">
                <h1 className="text-[22px] font-bold text-[#C84B4B] leading-tight">مؤسسة سحر الوقاية</h1>
                <p className="text-[15px] text-[#4A5BAE] font-semibold leading-tight">لأدوات ومواد السلامة</p>
                <p className="text-[15px] text-[#4A5BAE] font-semibold leading-tight">تبوك - تيماء</p>
                <p className="text-[17px] font-bold text-[#4A5BAE] mt-1 leading-tight">جوال: ٠٥٣٦٠٢٠٢٢٢</p>
              </div>
            </div>

            {/* Invoice Number and Title Row */}
            <div className="flex items-start justify-between pt-1">
              <div className="flex items-baseline gap-2">
                <span className="text-[15px] text-[#4A5BAE] font-medium">No.:</span>
                <span className="text-[28px] font-bold text-[#C84B4B] leading-none">{invoiceNumber || "100"}</span>
              </div>
              <div className="text-center -mt-2">
                <p className="text-[26px] font-bold text-[#4A5BAE] leading-tight">فاتورة</p>
                <p className="text-[22px] font-bold text-[#4A5BAE] leading-tight">Invoice</p>
              </div>
              <div className="text-right space-y-0">
                <p className="text-[14px] text-[#4A5BAE]">التاريخ / / ١٤هـ</p>
                <p className="text-[15px] text-[#4A5BAE] font-bold">
                  Date: {dateDay}/{dateMonth}/{dateYear}
                </p>
                <p className="text-[13px] text-[#4A5BAE] mt-1">{formattedDate}</p>
                <p className="text-[14px] text-[#4A5BAE] border-t border-[#4A5BAE]/30 pt-0.5 mt-1">المطلوب من المكرم</p>
              </div>
            </div>

            {/* Customer Name Line */}
            <div className="border-t border-[#4A5BAE]/30 pt-1">
              <div className="flex items-baseline gap-2">
                <span className="text-[14px] text-[#4A5BAE]">Messrs/Mr.</span>
                <div className="flex-1 border-b border-[#4A5BAE]/40 pb-0.5">
                  <span className="text-[16px] font-medium text-gray-800">{customerName}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-[2.5px] border-[#4A5BAE] rounded-lg overflow-hidden mt-4">
            {/* Table Header */}
            <div className="bg-[#E8E5DC] border-b-[2.5px] border-[#4A5BAE]">
              <div className="grid grid-cols-[2fr_0.8fr_0.8fr_1.2fr_1fr] gap-0 text-[#4A5BAE] font-bold text-sm">
                <div className="p-2.5 text-left border-r-[1.5px] border-[#4A5BAE]">
                  <p className="text-[13px] leading-tight">البـــــــيـــــــــــــــــان</p>
                  <p className="text-[15px] font-bold mt-0.5">Description</p>
                </div>
                <div className="p-2.5 text-center border-r-[1.5px] border-[#4A5BAE]">
                  <p className="text-[13px] leading-tight">الوحدة</p>
                  <p className="text-[15px] font-bold mt-0.5">Unit</p>
                </div>
                <div className="p-2.5 text-center border-r-[1.5px] border-[#4A5BAE]">
                  <p className="text-[13px] leading-tight">كيلو</p>
                  <p className="text-[15px] font-bold mt-0.5">Kg.</p>
                </div>
                <div className="p-2.5 text-center border-r-[1.5px] border-[#4A5BAE]">
                  <p className="text-[13px] leading-tight">السعر الافرادى</p>
                  <p className="text-[15px] font-bold mt-0.5">Unit Price</p>
                  <div className="flex justify-between text-[11px] mt-0.5 font-semibold">
                    <span>SR.</span>
                    <span>ريال</span>
                    <span>ه. ر</span>
                  </div>
                </div>
                <div className="p-2.5 text-center">
                  <p className="text-[13px] leading-tight">المبلغ الاجمالى</p>
                  <p className="text-[15px] font-bold mt-0.5">Total Price</p>
                  <div className="flex justify-between text-[11px] mt-0.5 font-semibold">
                    <span>SR.</span>
                    <span>ريال</span>
                    <span>ه. ر</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Table Body with Items */}
            <div
              className="relative"
              style={{
                backgroundImage: "url('/images/whatsapp-image-2025-12-01-at-6-35-50-pm-removebg-preview.png')",
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "200px 200px",
                backgroundBlendMode: "multiply",
                opacity: 0.95,
              }}
            >
              <div
                className="absolute left-8 bottom-12 w-48 h-48 z-10 pointer-events-none"
                style={{
                  backgroundImage: "url('/images/company-stamp-transparent.png')",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  opacity: 0.75,
                }}
              />

              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[2fr_0.8fr_0.8fr_1.2fr_1fr] gap-0 min-h-[55px] items-center border-b-[1.5px] border-[#4A5BAE]"
                >
                  <div className="p-2.5 min-h-[55px] flex items-center border-r-[1.5px] border-[#4A5BAE]">
                    <p className="text-[16px] font-medium text-gray-900">{item.description}</p>
                  </div>
                  <div className="p-2.5 min-h-[55px] flex items-center justify-center border-r-[1.5px] border-[#4A5BAE]">
                    <p className="text-[16px] text-gray-800 font-medium">{item.unit || "-"}</p>
                  </div>
                  <div className="p-2.5 min-h-[55px] flex items-center justify-center border-r-[1.5px] border-[#4A5BAE]">
                    <p className="text-[16px] text-gray-800 font-medium">{item.kg || "-"}</p>
                  </div>
                  <div className="p-2.5 min-h-[55px] flex items-center justify-center border-r-[1.5px] border-[#4A5BAE]">
                    <p className="text-[16px] text-gray-800 font-medium">{item.price}</p>
                  </div>
                  <div className="p-2.5 min-h-[55px] flex items-center justify-center bg-[#F5F1E8]">
                    <p className="text-[17px] font-semibold text-gray-900">{item.price}</p>
                  </div>
                </div>
              ))}

              {Array.from({ length: emptyRowsCount }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="grid grid-cols-[2fr_0.8fr_0.8fr_1.2fr_1fr] gap-0 min-h-[55px] border-b-[1.5px] border-[#4A5BAE]"
                >
                  <div className="p-2.5 min-h-[55px] border-r-[1.5px] border-[#4A5BAE]"></div>
                  <div className="p-2.5 min-h-[55px] border-r-[1.5px] border-[#4A5BAE]"></div>
                  <div className="p-2.5 min-h-[55px] border-r-[1.5px] border-[#4A5BAE]"></div>
                  <div className="p-2.5 min-h-[55px] border-r-[1.5px] border-[#4A5BAE]"></div>
                  <div className="p-2.5 min-h-[55px] bg-[#F5F1E8]"></div>
                </div>
              ))}
            </div>

            {/* Total Row */}
            <div className="border-t-[2.5px] border-[#4A5BAE] bg-[#E8E5DC]">
              <div className="grid grid-cols-[4.6fr_1fr] gap-0 items-center">
                <div className="p-2.5 flex items-center gap-4">
                  <span className="text-[15px] font-bold text-[#4A5BAE]">Total</span>
                  <div className="flex-1 border-b border-[#4A5BAE]/30"></div>
                  <span className="text-[15px] font-bold text-[#4A5BAE]">المجموع</span>
                </div>
                <div className="p-2.5 flex items-center justify-center">
                  <p className="text-[22px] font-bold text-[#4A5BAE]">{total}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <div className="space-y-3 pt-3">
            {/* Received By Line */}
            <div className="flex items-center gap-3">
              <span className="text-[15px] font-semibold text-[#4A5BAE]">Received by:</span>
              <div className="flex-1 border-b-[2px] border-[#4A5BAE]/40 pb-1 min-h-[30px]"></div>
              <span className="text-[15px] font-semibold text-[#4A5BAE]">:المستلم</span>
            </div>

            {/* Product Icons Strip */}
            <div className="py-2">
              <img
                src="/images/whatsapp-image-2025-12-01-at-6-36-08-pm-removebg-preview.png"
                alt="Safety Equipment"
                className="w-full h-12 object-contain"
              />
            </div>

            {/* Red Footer Bar with Company Details */}
            <div className="bg-[#C84B4B] text-white px-4 py-3 rounded-sm text-center space-y-1.5">
              <p className="text-[11px] leading-relaxed font-medium">
                ٣٥٥٤٠٠١٢٢٢ المملكة العربية السعودية - تبوك- تيماء - الشارع خالد بن وليد - س. ت:
              </p>
              <p className="text-[11px] leading-relaxed font-medium">
                Saudi Arabia - Tabuk - Taima - Khaled Bin Waleed St. - C.R. 3554001573
              </p>
              <p className="text-[11px] leading-relaxed font-medium">Email: bandarfalah@hotmail.com</p>
            </div>
          </div>
        </Card>
      </div>
    </main>
  )
}
