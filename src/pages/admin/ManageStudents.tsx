import DashboardLayout from "@/components/DashboardLayout";
import { Users, Search } from "lucide-react";
import { useState } from "react";

const allStudents = [
  { name: "Kwame Mensah", index: "UMaT/PG/0234/22", program: "MSc. IT", department: "Computer Science", status: "Active" },
  { name: "Ama Serwaa", index: "UMaT/PG/0198/22", program: "MSc. IT", department: "Computer Science", status: "Active" },
  { name: "Yaw Boateng", index: "UMaT/PG/0312/22", program: "MPhil CS", department: "Computer Science", status: "Active" },
  { name: "Efua Dankwah", index: "UMaT/PG/0287/22", program: "MSc. IT", department: "Computer Science", status: "Inactive" },
  { name: "Kofi Adjei", index: "UMaT/PG/0345/22", program: "MPhil CS", department: "Computer Science", status: "Active" },
  { name: "Abena Owusu", index: "UMaT/PG/0401/23", program: "MSc. Mining Eng", department: "Mining Engineering", status: "Active" },
];

const ManageStudents = () => {
  const [search, setSearch] = useState("");
  const filtered = allStudents.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.index.includes(search)
  );

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">Manage Students</h1>
          <p className="text-muted-foreground mt-1">{allStudents.length} registered postgraduate students</p>
        </div>
        <button className="px-5 py-2.5 rounded-lg gradient-gold text-secondary-foreground font-medium text-sm hover:opacity-90 transition-opacity">
          + Enroll Student
        </button>
      </div>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or index number..."
          className="w-full pl-11 pr-4 py-3 rounded-lg border border-input bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Index</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Program</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Department</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.index} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer">
                <td className="px-6 py-4 text-sm font-medium text-foreground">{s.name}</td>
                <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{s.index}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{s.program}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{s.department}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    s.status === "Active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                  }`}>
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default ManageStudents;
