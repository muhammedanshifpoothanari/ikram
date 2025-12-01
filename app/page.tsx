"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, List, Edit, Search, Save, Eye } from "lucide-react"
import { BillPreview } from "@/components/bill-preview"

interface BillItem {
  id: string
  description: string
  unit: string
  kg: string
  price: number
}

interface Bill {
  _id?: string
  id: string
  invoiceNumber: string
  customerName: string
  items: BillItem[]
  total: number
  date: string
}

export default function BillGenerator() {
  const [bills, setBills] = useState<Bill[]>([])
  const [currentView, setCurrentView] = useState<"list" | "create" | "preview">("list")
  const [editingBillId, setEditingBillId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [previewBill, setPreviewBill] = useState<Bill | null>(null)
  const [loading, setLoading] = useState(false)

  const [invoiceNumber, setInvoiceNumber] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [items, setItems] = useState<BillItem[]>([{ id: "1", description: "", unit: "", kg: "", price: 0 }])
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    fetchBills()
  }, [])

  const fetchBills = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/bills")
      if (response.ok) {
        const data = await response.json()
        setBills(data)
      }
    } catch (error) {
      console.error("Error fetching bills:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!editingBillId) {
      const maxInvoiceNumber = bills.reduce((max, bill) => {
        const num = Number.parseInt(bill.invoiceNumber) || 0
        return num > max ? num : max
      }, 99)
      setInvoiceNumber((maxInvoiceNumber + 1).toString())
    }
  }, [bills, editingBillId])

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: "", unit: "", kg: "", price: 0 }])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id))
    }
  }

  const updateItem = (id: string, field: keyof BillItem, value: string | number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.price, 0)
  }

  const saveBill = async () => {
    const newBill = {
      id: editingBillId || Date.now().toString(),
      invoiceNumber,
      customerName,
      items,
      total: calculateTotal(),
      date: new Date().toISOString(),
    }

    try {
      setLoading(true)

      if (editingBillId) {
        // Update existing bill
        const response = await fetch(`/api/bills/${editingBillId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newBill),
        })

        if (response.ok) {
          await fetchBills()
        }
      } else {
        // Create new bill
        const response = await fetch("/api/bills", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newBill),
        })

        if (response.ok) {
          await fetchBills()
        }
      }

      setPreviewBill(newBill)
      setCurrentView("preview")
    } catch (error) {
      console.error("Error saving bill:", error)
      alert("Failed to save bill. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setInvoiceNumber("")
    setCustomerName("")
    setItems([{ id: "1", description: "", unit: "", kg: "", price: 0 }])
    setEditingBillId(null)
  }

  const editBill = (bill: Bill) => {
    setInvoiceNumber(bill.invoiceNumber)
    setCustomerName(bill.customerName)
    setItems(bill.items)
    setEditingBillId(bill._id || bill.id)
    setCurrentView("create")
  }

  const deleteBill = async (id: string) => {
    if (confirm("Are you sure you want to delete this bill?")) {
      try {
        setLoading(true)
        const response = await fetch(`/api/bills/${id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          await fetchBills()
        }
      } catch (error) {
        console.error("Error deleting bill:", error)
        alert("Failed to delete bill. Please try again.")
      } finally {
        setLoading(false)
      }
    }
  }

  const filteredBills = bills.filter(
    (bill) =>
      bill.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.customerName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (currentView === "preview" && previewBill) {
    return (
      <BillPreview
        invoiceNumber={previewBill.invoiceNumber}
        customerName={previewBill.customerName}
        items={previewBill.items}
        total={previewBill.total}
        onBack={() => {
          setCurrentView("list")
          setPreviewBill(null)
          resetForm()
        }}
      />
    )
  }

  if (showPreview) {
    return (
      <BillPreview
        invoiceNumber={invoiceNumber}
        customerName={customerName}
        items={items}
        total={calculateTotal()}
        onBack={() => setShowPreview(false)}
        onSave={saveBill}
      />
    )
  }

  if (currentView === "list") {
    return (
      <main className="min-h-screen p-4 pb-20 bg-background">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center pt-4">
            <div className="flex items-center justify-center gap-3 mb-3">
              <img
                src="/images/whatsapp-image-2025-12-01-at-6-35-50-pm-removebg-preview.png"
                alt="Company Logo"
                className="w-16 h-16 object-contain"
                style={{
                  filter: "brightness(1.1) saturate(1.4)",
                }}
              />
            </div>
            <h1 className="text-3xl font-bold text-[#C84B4B] mb-1">SEHR AL WEQAIAH Est.</h1>
            <p className="text-lg text-[#4A5BAE] font-semibold">مؤسسة سحر الوقاية</p>
            <p className="text-base text-muted-foreground mt-2">Invoice Management System</p>
          </div>

          <Card className="p-4">
            <div className="space-y-3">
              <Label htmlFor="search" className="text-lg font-medium">
                Search Bills
              </Label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by invoice number or customer name"
                  className="h-14 text-lg pl-12"
                />
              </div>
            </div>
          </Card>

          <Button
            onClick={() => {
              resetForm()
              setCurrentView("create")
            }}
            size="lg"
            className="w-full h-16 text-xl gap-3"
            disabled={loading}
          >
            <Plus className="h-6 w-6" />
            Create New Bill
          </Button>

          {loading ? (
            <Card className="p-8 text-center">
              <p className="text-xl text-muted-foreground">Loading bills...</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredBills.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-xl text-muted-foreground">
                    {searchQuery ? "No bills found matching your search" : "No bills yet. Create your first bill!"}
                  </p>
                </Card>
              ) : (
                filteredBills.map((bill) => (
                  <Card key={bill._id || bill.id} className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <h3 className="text-2xl font-bold text-foreground">Invoice #{bill.invoiceNumber}</h3>
                        <p className="text-lg text-muted-foreground">Customer: {bill.customerName}</p>
                        <p className="text-base text-muted-foreground">
                          {new Date(bill.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-3xl font-bold text-primary">{bill.total.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={() => {
                          setPreviewBill(bill)
                          setCurrentView("preview")
                        }}
                        variant="secondary"
                        size="lg"
                        className="h-14 gap-2 flex-1"
                      >
                        <Eye className="h-5 w-5" />
                        View
                      </Button>
                      <Button onClick={() => editBill(bill)} variant="outline" size="lg" className="h-14 gap-2 flex-1">
                        <Edit className="h-5 w-5" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => deleteBill(bill._id || bill.id)}
                        variant="destructive"
                        size="lg"
                        className="h-14 gap-2 flex-1"
                      >
                        <Trash2 className="h-5 w-5" />
                        Delete
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-4 pb-20 bg-background">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2 pt-4">
          <h1 className="text-4xl font-bold text-foreground">{editingBillId ? "Edit Bill" : "Create Bill"}</h1>
          <p className="text-lg text-muted-foreground">
            {editingBillId ? "Update invoice details" : "Create new invoice"}
          </p>
        </div>

        <Button
          onClick={() => {
            resetForm()
            setCurrentView("list")
          }}
          variant="outline"
          size="lg"
          className="w-full h-14 gap-2"
        >
          <List className="h-5 w-5" />
          Back to Bills List
        </Button>

        <Card className="p-6 space-y-6">
          <h2 className="text-2xl font-semibold text-card-foreground">Invoice Details</h2>

          <div className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="invoice-number" className="text-lg font-medium">
                Invoice Number
              </Label>
              <Input
                id="invoice-number"
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="e.g., 100"
                className="h-14 text-lg"
                readOnly={!editingBillId}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="customer-name" className="text-lg font-medium">
                Customer Name
              </Label>
              <Input
                id="customer-name"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
                className="h-14 text-lg"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-card-foreground">Items</h2>
            <Button onClick={addItem} size="lg" className="h-12 gap-2 text-base">
              <Plus className="h-5 w-5" />
              Add Item
            </Button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="p-4 border border-border rounded-lg space-y-4 bg-card/50">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-foreground">Item {index + 1}</span>
                  {items.length > 1 && (
                    <Button
                      onClick={() => removeItem(item.id)}
                      variant="destructive"
                      size="sm"
                      className="h-10 w-10 p-0"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor={`description-${item.id}`} className="text-base font-medium">
                    Description (البيان)
                  </Label>
                  <Input
                    id={`description-${item.id}`}
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    placeholder="e.g., Fire Extinguisher, Powder, Safety Helmet"
                    className="h-14 text-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label htmlFor={`unit-${item.id}`} className="text-base font-medium">
                      Unit (الوحدة)
                    </Label>
                    <Input
                      id={`unit-${item.id}`}
                      type="text"
                      value={item.unit}
                      onChange={(e) => updateItem(item.id, "unit", e.target.value)}
                      placeholder="e.g., 1, 2, 5"
                      className="h-14 text-lg"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor={`kg-${item.id}`} className="text-base font-medium">
                      Kg (كيلو)
                    </Label>
                    <Input
                      id={`kg-${item.id}`}
                      type="text"
                      value={item.kg}
                      onChange={(e) => updateItem(item.id, "kg", e.target.value)}
                      placeholder="e.g., 6kg, 9kg"
                      className="h-14 text-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label htmlFor={`price-${item.id}`} className="text-base font-medium">
                      Unit Price (السعر الافرادي)
                    </Label>
                    <Input
                      id={`price-${item.id}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => updateItem(item.id, "price", Number.parseFloat(e.target.value) || 0)}
                      placeholder="e.g., 30"
                      className="h-14 text-lg"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-medium">Total Price (المبلغ الاجمالي)</Label>
                    <div className="h-14 flex items-center px-4 bg-muted rounded-md">
                      <span className="text-xl font-bold text-foreground">{item.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-primary text-primary-foreground">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-semibold">Total Amount:</span>
            <span className="text-4xl font-bold">{calculateTotal().toFixed(2)}</span>
          </div>
        </Card>

        <div className="flex gap-3">
          <Button
            onClick={() => setShowPreview(true)}
            variant="outline"
            size="lg"
            className="h-16 text-xl gap-3 flex-1"
            disabled={loading}
          >
            <Eye className="h-6 w-6" />
            Live Preview
          </Button>
          <Button onClick={saveBill} size="lg" className="h-16 text-xl gap-3 flex-1" disabled={loading}>
            <Save className="h-6 w-6" />
            {loading ? "Saving..." : "Save Bill"}
          </Button>
        </div>
      </div>
    </main>
  )
}
