import React, { useState, useEffect } from 'react';
import { Trash2, Edit2, Lock, Unlock, FileText, Plus, Save } from 'lucide-react';

interface Entry {
    id: string;
    date: string;
    hours: number;
}

interface BillingState {
    studentName: string;
    ratePerHour: number;
    previousBalance: number;
    month: string;
    isLocked: boolean;
    entries: Entry[];
}

const RATES = [150, 200, 250, 300];

export default function BillingSystem() {
    const [state, setState] = useState<BillingState>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('tuition-billing-state');
            if (saved) return JSON.parse(saved);
        }
        return {
            studentName: '',
            ratePerHour: 150,
            previousBalance: 0,
            month: new Date().toISOString().slice(0, 7),
            isLocked: false,
            entries: []
        };
    });

    const [date, setDate] = useState('');
    const [hours, setHours] = useState('');
    const [editId, setEditId] = useState<string | null>(null);

    useEffect(() => {
        localStorage.setItem('tuition-billing-state', JSON.stringify(state));
    }, [state]);

    const handleLockToggle = () => {
        if (!state.studentName) {
            alert("Please enter a student name first.");
            return;
        }
        setState(prev => ({ ...prev, isLocked: !prev.isLocked }));
    };

    const handleAddEntry = (e: React.FormEvent) => {
        e.preventDefault();
        if (!hours || !date) return;

        const numHours = parseFloat(hours);
        if (isNaN(numHours) || numHours <= 0) return;

        if (editId) {
            setState(prev => ({
                ...prev,
                entries: prev.entries.map(ent => ent.id === editId ? { ...ent, date, hours: numHours } : ent)
            }));
            setEditId(null);
        } else {
            const newEntry: Entry = {
                id: crypto.randomUUID(),
                date,
                hours: numHours
            };
            setState(prev => ({
                ...prev,
                entries: [...prev.entries, newEntry].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            }));
        }
        setHours('');
        setDate('');
    };

    const handleEdit = (entry: Entry) => {
        setDate(entry.date);
        setHours(entry.hours.toString());
        setEditId(entry.id);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this entry?')) {
            setState(prev => ({
                ...prev,
                entries: prev.entries.filter(e => e.id !== id)
            }));
        }
    };

    const calculateTotals = () => {
        const totalHours = state.entries.reduce((sum, e) => sum + e.hours, 0);
        const totalBill = totalHours * state.ratePerHour;
        const grandTotal = totalBill + state.previousBalance;
        return { totalHours, totalBill, grandTotal };
    };

    const totals = calculateTotals();

    const generatePDF = async () => {
        const { default: jsPDF } = await import('jspdf');
        const { default: autoTable } = await import('jspdf-autotable');

        const doc = new jsPDF();
        const monthName = new Date(state.month + '-01').toLocaleString('default', { month: 'long', year: 'numeric' });

        doc.setFontSize(20);
        doc.text('Tuition Fee Invoice', 105, 20, { align: 'center' });

        doc.setFontSize(12);
        doc.text(`Student Name: ${state.studentName}`, 20, 40);
        doc.text(`Month: ${monthName}`, 20, 50);
        doc.text(`Rate per Hour: ₹${state.ratePerHour}`, 20, 60);

        let startY = 70;
        if (state.previousBalance > 0) {
            doc.text(`Previous Balance: ₹${state.previousBalance.toFixed(2)}`, 20, 70);
            startY = 80;
        }

        autoTable(doc, {
            startY,
            head: [['Date', 'Hours', 'Amount (₹)']],
            body: state.entries.map(e => [
                e.date,
                e.hours.toFixed(1),
                (e.hours * state.ratePerHour).toFixed(2)
            ]),
            theme: 'grid',
            headStyles: { fillColor: [66, 153, 225] }
        });

        const finalY = (doc as any).lastAutoTable.finalY + 10;

        doc.text(`Total Hours: ${totals.totalHours.toFixed(1)}`, 20, finalY);
        doc.text(`Current Bill: ₹${totals.totalBill.toFixed(2)}`, 20, finalY + 10);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(`Grand Total: ₹${totals.grandTotal.toFixed(2)}`, 20, finalY + 25);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Digitally signed by Alan Cyril Sunny', 105, 280, { align: 'center' });

        doc.save(`Tuition_Bill_${state.studentName}_${state.month}.pdf`);
    };

    const minDate = `${state.month}-01`;
    const maxDate = new Date(new Date(state.month).getFullYear(), new Date(state.month).getMonth() + 1, 0).toISOString().split('T')[0];

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">

            {/* Header Card */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Student Details
                    </h2>
                    <button
                        onClick={handleLockToggle}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${state.isLocked
                            ? 'bg-red-100 text-red-600 hover:bg-red-200'
                            : 'bg-green-100 text-green-600 hover:bg-green-200'
                            }`}
                    >
                        {state.isLocked ? <Lock size={18} /> : <Unlock size={18} />}
                        {state.isLocked ? 'Unlock Details' : 'Lock Details'}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">Student Name</label>
                        <input
                            type="text"
                            disabled={state.isLocked}
                            value={state.studentName}
                            onChange={e => setState(p => ({ ...p, studentName: e.target.value }))}
                            className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-all"
                            placeholder="Enter name..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">Previous Balance</label>
                        <input
                            type="number"
                            disabled={state.isLocked}
                            value={state.previousBalance}
                            onChange={e => setState(p => ({ ...p, previousBalance: parseFloat(e.target.value) || 0 }))}
                            className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">Rate (₹/hr)</label>
                        <select
                            disabled={state.isLocked}
                            value={state.ratePerHour}
                            onChange={e => setState(p => ({ ...p, ratePerHour: Number(e.target.value) }))}
                            className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-all"
                        >
                            {RATES.map(r => <option key={r} value={r}>₹{r}</option>)}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">Billing Month</label>
                        <input
                            type="month"
                            value={state.month}
                            onChange={e => setState(p => ({ ...p, month: e.target.value }))}
                            className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Entry Form */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Add Work Entry</h3>
                <form onSubmit={handleAddEntry} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 space-y-2 w-full">
                        <label className="text-sm font-medium text-gray-500">Date</label>
                        <input
                            type="date"
                            required
                            min={minDate}
                            max={maxDate}
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex-1 space-y-2 w-full">
                        <label className="text-sm font-medium text-gray-500">Hours</label>
                        <input
                            type="number"
                            step="0.1"
                            min="0.1"
                            required
                            value={hours}
                            onChange={e => setHours(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500"
                            placeholder="0.0"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!state.isLocked}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto justify-center"
                    >
                        {editId ? <Save size={18} /> : <Plus size={18} />}
                        {editId ? 'Update' : 'Add Entry'}
                    </button>
                </form>
                {!state.isLocked && (
                    <p className="text-amber-600 text-sm mt-2 flex items-center gap-1">
                        <Lock size={14} /> Lock details above to add entries.
                    </p>
                )}
            </div>

            {/* Entries Table */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl border border-white/20">
                <table className="w-full">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Hours</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {state.entries.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                                    No entries for this month yet.
                                </td>
                            </tr>
                        ) : (
                            state.entries.map(entry => (
                                <tr key={entry.id} className="hover:bg-blue-50/50 transition-colors group">
                                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                                        {new Date(entry.date).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{entry.hours}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700 font-mono">₹{(entry.hours * state.ratePerHour).toFixed(2)}</td>
                                    <td className="px-6 py-4 text-right space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEdit(entry)} className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(entry.id)} className="p-1 text-red-600 hover:bg-red-100 rounded">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Summary Footer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-500 text-white p-6 rounded-2xl shadow-lg shadow-blue-500/20">
                    <p className="text-blue-100 text-sm font-medium mb-1">Total Hours</p>
                    <p className="text-3xl font-bold">{totals.totalHours.toFixed(1)} <span className="text-sm font-normal opacity-70">hr</span></p>
                </div>
                <div className="bg-purple-500 text-white p-6 rounded-2xl shadow-lg shadow-purple-500/20">
                    <p className="text-purple-100 text-sm font-medium mb-1">Total Bill</p>
                    <p className="text-3xl font-bold">₹{totals.totalBill.toFixed(2)}</p>
                </div>
                <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-lg shadow-gray-900/20">
                    <p className="text-gray-400 text-sm font-medium mb-1">Grand Total</p>
                    <p className="text-3xl font-bold w-full truncate">₹{totals.grandTotal.toFixed(2)}</p>
                </div>
            </div>

            <button
                onClick={generatePDF}
                className="w-full py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
            >
                <FileText size={24} />
                Generate PDF Invoice
            </button>
        </div>
    );
}
