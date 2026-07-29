"use client";

import { useState, useEffect } from "react";
import { updateOrderStatusAction } from "@/app/actions/order-status";
import { updateOrderShippingAddressAction } from "@/app/actions/update-order-address";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  RefreshCw,
  Eye,
  Printer,
  XCircle,
  X,
  MapPin,
  Mail,
  User,
  AlertCircle,
  Edit2
} from "lucide-react";

const STATUS_STEPS = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];

export default function AdminOrdersDashboardClient({ initialOrders }: { initialOrders: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const highlightOrderId = searchParams.get("id");

  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Address edit state
  const [editingAddress, setEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Auto-open drawer if redirected with ?id=
  useEffect(() => {
    if (highlightOrderId) {
      const match = orders.find((o) => o.id === highlightOrderId || o.orderNumber === highlightOrderId);
      if (match) setSelectedOrder(match);
    }
  }, [highlightOrderId, orders]);

  // Sync address form when selectedOrder changes
  useEffect(() => {
    if (selectedOrder?.shippingAddress) {
      setAddressForm({
        street: selectedOrder.shippingAddress.street || selectedOrder.shippingAddress.address || "",
        city: selectedOrder.shippingAddress.city || "",
        state: selectedOrder.shippingAddress.state || "",
        pincode: selectedOrder.shippingAddress.pincode || selectedOrder.shippingAddress.postalCode || "",
      });
    }
  }, [selectedOrder]);

  const filteredOrders = orders
    .filter((o) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        o.orderNumber.toLowerCase().includes(q) ||
        (o.guestName && o.guestName.toLowerCase().includes(q)) ||
        (o.guestEmail && o.guestEmail.toLowerCase().includes(q)) ||
        (o.id && o.id.toLowerCase().includes(q));

      const matchesStatus = !statusFilter || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const tA = new Date(a.createdAt).getTime();
      const tB = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? tB - tA : tA - tB;
    });

  const totalOrders = orders.length;
  const pendingCount = orders.filter((o) => o.status === "PENDING").length;
  const processingCount = orders.filter((o) => o.status === "PROCESSING").length;
  const shippedCount = orders.filter((o) => o.status === "SHIPPED").length;
  const deliveredCount = orders.filter((o) => o.status === "DELIVERED").length;
  const cancelledCount = orders.filter((o) => o.status === "CANCELLED").length;

  const todayStr = new Date().toISOString().split("T")[0];
  const todayOrders = orders.filter((o) => new Date(o.createdAt).toISOString().split("T")[0] === todayStr);
  const revenueToday = todayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    const res = await updateOrderStatusAction(orderId, newStatus);
    if (res.success) {
      setNotice(`Order status updated to ${newStatus}`);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev: any) => ({ ...prev, status: newStatus }));
      }
      router.refresh();
    }
    setUpdatingId(null);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setUpdatingId(selectedOrder.id);
    const res = await updateOrderShippingAddressAction(selectedOrder.id, addressForm);
    if (res.success) {
      setNotice("Shipping address updated successfully.");
      setEditingAddress(false);
      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrder.id ? { ...o, shippingAddress: addressForm } : o))
      );
      setSelectedOrder((prev: any) => ({ ...prev, shippingAddress: addressForm }));
      router.refresh();
    }
    setUpdatingId(null);
  };

  const handlePrintItemInvoice = () => {
    window.print();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold rounded-full uppercase">Delivered</span>;
      case "SHIPPED":
        return <span className="px-2.5 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold rounded-full uppercase">Shipped</span>;
      case "PROCESSING":
        return <span className="px-2.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold rounded-full uppercase">Processing</span>;
      case "CANCELLED":
        return <span className="px-2.5 py-0.5 bg-rose-50 text-rose-800 border border-rose-200 text-[10px] font-bold rounded-full uppercase">Cancelled</span>;
      default:
        return <span className="px-2.5 py-0.5 bg-slate-100 text-slate-800 border border-slate-200 text-[10px] font-bold rounded-full uppercase">Pending</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {notice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-md flex justify-between items-center">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="font-bold">Dismiss</button>
        </div>
      )}

      {/* Top Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 print:hidden">
        <div className="bg-white border border-[#E7E5E4] rounded-md p-3.5 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Total Orders</span>
          <p className="text-lg font-bold text-[#111827]">{totalOrders}</p>
        </div>

        <div className="bg-white border border-[#E7E5E4] rounded-md p-3.5 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Pending</span>
          <p className="text-lg font-bold text-amber-700">{pendingCount}</p>
        </div>

        <div className="bg-white border border-[#E7E5E4] rounded-md p-3.5 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Processing</span>
          <p className="text-lg font-bold text-blue-700">{processingCount}</p>
        </div>

        <div className="bg-white border border-[#E7E5E4] rounded-md p-3.5 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Shipped</span>
          <p className="text-lg font-bold text-indigo-700">{shippedCount}</p>
        </div>

        <div className="bg-white border border-[#E7E5E4] rounded-md p-3.5 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Delivered</span>
          <p className="text-lg font-bold text-emerald-700">{deliveredCount}</p>
        </div>

        <div className="bg-white border border-[#E7E5E4] rounded-md p-3.5 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Cancelled</span>
          <p className="text-lg font-bold text-rose-700">{cancelledCount}</p>
        </div>

        <div className="bg-white border border-[#E7E5E4] rounded-md p-3.5 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Today</span>
          <p className="text-lg font-bold text-[#111827]">{todayOrders.length}</p>
        </div>

        <div className="bg-white border border-[#E7E5E4] rounded-md p-3.5 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Revenue Today</span>
          <p className="text-lg font-bold text-[#111827]">₹{revenueToday}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-[#E7E5E4] rounded-md p-4 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Search className="w-4 h-4 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search order ID, customer name, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs text-[#111827] focus:outline-none focus:border-[#111827] w-full sm:w-72"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs text-[#111827]"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="px-3 py-1.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs text-[#111827]"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>

          <button
            onClick={() => router.refresh()}
            className="p-1.5 bg-[#FAFAF8] hover:bg-[#F4F4F0] border border-[#E7E5E4] rounded text-[#111827]"
            title="Refresh Orders"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#E7E5E4] rounded-md overflow-hidden print:hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-[#6B7280] text-xs space-y-2">
            <AlertCircle className="w-8 h-8 mx-auto text-[#9CA3AF]" />
            <p className="font-bold text-[#111827]">No orders found</p>
            <p className="text-[#6B7280]">Try adjusting your search criteria or filter status.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#111827]">
              <thead className="bg-[#FAFAF8] text-[10px] uppercase font-bold text-[#6B7280] border-b border-[#E7E5E4] tracking-wider sticky top-0">
                <tr>
                  <th className="px-6 py-3.5">Order ID</th>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Products</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Total</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E5E4]">
                {filteredOrders.map((o) => {
                  const firstItem = o.items?.[0];
                  const extraItemsCount = (o.items?.length || 1) - 1;

                  return (
                    <tr key={o.id} className="hover:bg-[#FAFAF8] transition-colors cursor-pointer" onClick={() => setSelectedOrder(o)}>
                      <td className="px-6 py-4 font-mono font-bold text-[#111827]">
                        {o.orderNumber}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#111827] text-white flex items-center justify-center text-[10px] font-bold">
                            {(o.guestName || "C").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-[#111827]">{o.guestName || "Registered Customer"}</p>
                            <p className="text-[10px] text-[#6B7280]">{o.guestEmail}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {firstItem?.product?.images?.[0] ? (
                            <img src={firstItem.product.images[0]} alt={firstItem.product.name} className="w-8 h-8 object-cover rounded bg-[#F4F4F0] border border-[#E7E5E4]" />
                          ) : (
                            <div className="w-8 h-8 bg-[#E7E5E4] rounded flex items-center justify-center text-[9px] font-bold">Item</div>
                          )}
                          <span className="font-medium text-[#111827]">
                            {firstItem?.product?.name || "Garment"}
                            {extraItemsCount > 0 && <span className="text-[#6B7280] font-normal"> +{extraItemsCount} more</span>}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-[#6B7280] text-[11px]">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4 font-bold text-[#111827]">
                        ₹{o.totalAmount}
                      </td>

                      <td className="px-6 py-4">
                        {getStatusBadge(o.status)}
                      </td>

                      <td className="px-6 py-4 text-right space-x-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="p-1.5 bg-[#FAFAF8] hover:bg-[#F4F4F0] text-[#111827] border border-[#E7E5E4] rounded inline-block"
                          title="View Details Drawer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => { setSelectedOrder(o); setTimeout(handlePrintItemInvoice, 100); }}
                          className="p-1.5 bg-[#FAFAF8] hover:bg-[#F4F4F0] text-[#111827] border border-[#E7E5E4] rounded inline-block"
                          title="Print Item Invoice"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        {o.status !== "CANCELLED" && o.status !== "DELIVERED" && (
                          <button
                            onClick={() => handleStatusUpdate(o.id, "CANCELLED")}
                            disabled={updatingId === o.id}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded inline-block"
                            title="Cancel Order"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Side Drawer View / Printable Order Invoice */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end print:static print:bg-white">
          <div className="bg-white border-l border-[#E7E5E4] w-full max-w-lg h-full overflow-y-auto p-6 space-y-6 shadow-2xl flex flex-col justify-between print:border-none print:shadow-none print:max-w-none">
            <div className="space-y-6">
              {/* Drawer Title Bar */}
              <div className="flex items-center justify-between border-b border-[#E7E5E4] pb-4">
                <div>
                  <h2 className="text-base font-bold text-[#111827]">Order Item Invoice</h2>
                  <p className="text-xs font-mono text-[#6B7280]">{selectedOrder.orderNumber}</p>
                </div>
                <div className="flex items-center gap-2 print:hidden">
                  <button
                    onClick={handlePrintItemInvoice}
                    className="px-3 py-1 bg-[#111827] text-white rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print
                  </button>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-1.5 text-[#6B7280] hover:text-[#111827] rounded"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Status Stage Controls */}
              <div className="bg-[#FAFAF8] border border-[#E7E5E4] rounded-md p-4 space-y-2 print:hidden">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Update Status Stage</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {STATUS_STEPS.map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusUpdate(selectedOrder.id, st)}
                      disabled={updatingId === selectedOrder.id}
                      className={`py-1.5 text-[10px] font-bold rounded uppercase border transition-colors ${
                        selectedOrder.status === st
                          ? "bg-[#111827] text-white border-[#111827]"
                          : "bg-white text-[#6B7280] border-[#E7E5E4] hover:border-[#111827]"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Info */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827]">Customer Information</h3>
                <div className="bg-white border border-[#E7E5E4] rounded-md p-3.5 space-y-1.5 text-xs text-[#111827]">
                  <p className="font-bold flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-[#6B7280]" /> {selectedOrder.guestName || "Registered Customer"}
                  </p>
                  <p className="text-[#6B7280] flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#9CA3AF]" /> {selectedOrder.guestEmail}
                  </p>
                </div>
              </div>

              {/* Editable Shipping Address */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827]">Shipping Address</h3>
                  <button
                    onClick={() => setEditingAddress(!editingAddress)}
                    className="text-[10px] font-bold uppercase tracking-wider text-[#111827] hover:underline flex items-center gap-1 print:hidden"
                  >
                    <Edit2 className="w-3 h-3" /> {editingAddress ? "Cancel" : "Edit Address"}
                  </button>
                </div>

                {editingAddress ? (
                  <form onSubmit={handleSaveAddress} className="bg-white border border-[#E7E5E4] rounded-md p-3.5 space-y-2 print:hidden">
                    <input
                      type="text"
                      placeholder="Street Address"
                      required
                      value={addressForm.street}
                      onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs text-[#111827]"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="City"
                        required
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs text-[#111827]"
                      />
                      <input
                        type="text"
                        placeholder="State"
                        required
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs text-[#111827]"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Pincode"
                      required
                      value={addressForm.pincode}
                      onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs text-[#111827]"
                    />
                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        disabled={updatingId === selectedOrder.id}
                        className="px-3 py-1 bg-[#111827] text-white text-[10px] font-bold rounded uppercase"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="bg-white border border-[#E7E5E4] rounded-md p-3.5 text-xs space-y-1 text-[#111827]">
                    <p className="font-bold flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#6B7280]" /> {selectedOrder.shippingAddress?.street || selectedOrder.shippingAddress?.address}
                    </p>
                    <p className="text-[#6B7280] pl-5">
                      {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.pincode || selectedOrder.shippingAddress?.postalCode}
                    </p>
                  </div>
                )}
              </div>

              {/* Ordered Items Breakdown */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827]">Ordered Items ({selectedOrder.items?.length || 0})</h3>
                <div className="divide-y divide-[#E7E5E4] border border-[#E7E5E4] rounded-md bg-[#FAFAF8]">
                  {selectedOrder.items?.map((item: any) => (
                    <div key={item.id} className="p-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        {item.product?.images?.[0] && (
                          <img src={item.product.images[0]} alt={item.product.name} className="w-10 h-10 object-cover rounded bg-white border border-[#E7E5E4]" />
                        )}
                        <div>
                          <p className="font-bold text-[#111827]">{item.product?.name || "Garment"}</p>
                          <p className="text-[10px] text-[#6B7280]">Qty: {item.quantity} • ₹{item.price}</p>
                        </div>
                      </div>
                      <span className="font-bold text-[#111827]">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Total */}
            <div className="pt-4 border-t border-[#E7E5E4] flex items-center justify-between">
              <span className="text-xs text-[#6B7280]">Total Paid Amount</span>
              <span className="text-lg font-bold text-[#111827]">₹{selectedOrder.totalAmount}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
