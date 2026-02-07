
export default function PlaceholderPage({ title }: { title: string }) {
    return (
        <div className="h-full flex flex-col justify-center items-center text-center p-12 bg-white rounded-xl border border-dashed border-gray-300">
            <div className="bg-blue-50 p-4 rounded-full mb-4">
                <span className="text-4xl">🚧</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{title} Module</h2>
            <p className="text-gray-500 mt-2 max-w-md">
                This module is currently under active development. The interface and functionality as described in the NEURYNTH migration plan will be implemented here.
            </p>
            <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Initialize Module
            </button>
        </div>
    );
}
