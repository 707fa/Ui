import { DataTable } from '../../components/ui/DataTable';


interface Employee {
    id: string;
    name: string;
    role: string;
    department: string;
    email: string;
    status: "Active" | "On Leave" | "Terminated";
}

const data: Employee[] = [
    { id: "EMP-001", name: "John Doe", role: "Software Engineer", department: "Engineering", email: "john@neurynth.com", status: "Active" },
    { id: "EMP-002", name: "Jane Smith", role: "Product Manager", department: "Product", email: "jane@neurynth.com", status: "Active" },
    { id: "EMP-003", name: "Mike Johnson", role: "Designer", department: "Design", email: "mike@neurynth.com", status: "On Leave" },
    { id: "EMP-004", name: "Sarah Connor", role: "Security Chief", department: "Operations", email: "sarah@neurynth.com", status: "Active" },
    { id: "EMP-005", name: "Robert Stark", role: "CEO", department: "Executive", email: "robert@neurynth.com", status: "Active" },
    { id: "EMP-006", name: "Emily Blunt", role: "HR Specialist", department: "Human Resources", email: "emily@neurynth.com", status: "Active" },
    { id: "EMP-007", name: "Chris Evans", role: "Sales Lead", department: "Sales", email: "chris@neurynth.com", status: "Terminated" },
];

export default function Employees() {
    const columns = [
        {
            header: "Employee",
            accessorKey: "name" as keyof Employee,
            cell: (item: Employee) => (
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold text-xs">
                        {item.name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.id}</p>
                    </div>
                </div>
            )
        },
        { header: "Role", accessorKey: "role" as keyof Employee },
        { header: "Department", accessorKey: "department" as keyof Employee },
        { header: "Email", accessorKey: "email" as keyof Employee },
        {
            header: "Status",
            accessorKey: "status" as keyof Employee,
            cell: (item: Employee) => {
                const styles = {
                    Active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                    "On Leave": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
                    Terminated: "bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-400"
                };
                return (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${styles[item.status]}`}>
                        {item.status}
                    </span>
                );
            }
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Human Resources</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Directory of all active and past employees.</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors">
                    + Add Employee
                </button>
            </div>

            <DataTable data={data} columns={columns} title="Employee Directory" searchKey="name" searchPlaceholder="Search employees..." />
        </div>
    );
}
