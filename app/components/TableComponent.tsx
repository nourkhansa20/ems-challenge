/**
 * TableComponent is a reusable and highly customizable table component for displaying tabular data.
 * It supports features like:
 * - Sorting by column headers.
 * - Pagination for large datasets.
 * - Search functionality to filter rows.
 * - Customizable column rendering via `renderColumn`.
 * - Integration with action buttons and custom filters.
 * - Dynamic table headers and data.
 * - Optional row click handlers for navigation or actions.
 * - Responsive design with customizable class names.
 */

import React, { useState } from "react";
import { useNavigate } from "react-router";

interface TableComponentProps {
    name?: string;
    data?: any[];
    headers?: string[];
    rowsPerPage?: number;
    tableClassName?: string;
    headerClassName?: string;
    actionComponent?: React.ComponentType<{ row: any }>;
    filterFields?: React.ComponentType<{ row: any }>;
    onRowClick?: (row: any) => void;
    renderColumn?: (params: { column: string; value: any; row: any }) => React.ReactNode;
    onActionButtonClick?: () => void;
}

const TableComponent: React.FC<TableComponentProps> = ({
    name = "Table", 
    data = [],
    headers = [],
    rowsPerPage = 5,
    tableClassName = "w-full",
    headerClassName,
    actionComponent: ActionComponent,
    filterFields: FilterFields,
    onRowClick,
    renderColumn,
    onActionButtonClick,
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<{ column: string; order: "asc" | "desc" } | null>(null);
    const navigate = useNavigate();

    const sortedData = sortConfig
        ? [...data].sort((a, b) => {
            const { column, order } = sortConfig;
            const valA = a[column] ?? "";
            const valB = b[column] ?? "";

            if (typeof valA === "number" && typeof valB === "number") {
                return order === "asc" ? valA - valB : valB - valA;
            } else {
                return order === "asc"
                    ? String(valA).localeCompare(String(valB))
                    : String(valB).localeCompare(String(valA));
            }
        })
        : data;

    const filteredData = sortedData.filter((row) =>
        headers.some((header) =>
            row[header]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const handleSort = (column: string) => {
        setSortConfig((prevConfig) => {
            if (prevConfig?.column === column) {
                return {
                    column,
                    order: prevConfig.order === "asc" ? "desc" : "asc",
                };
            }
            return { column, order: "asc" };
        });
    };

    // Pagination
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    return (
        <div className="w-full border rounded-xl border-gray-300 p-6">
            {/* Table Header */}
            <h1 className="font-bold text-3xl">
                {capitalizeFirstLetter(name)}s
            </h1>

            {/* Search and Action Buttons */}
            <div className="flex justify-between items-center py-5 px-3">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="field w-[50ex]"
                    aria-label="Search"
                />
                <div className="flex gap-3">
                    {FilterFields && <FilterFields />}
                    <button
                        onClick={onActionButtonClick ? onActionButtonClick : () => navigate(`/${name}s/new`)}
                        className="primary-button"
                        aria-label={`Add new ${name}`}
                    >
                        + Add new {name}
                    </button>
                </div>
            </div>

            {/* Table */}
            <table className={`${tableClassName} border-gray-300`}>
                <thead className="text-xs border-b border-gray-300">
                    <tr>
                        {headers.map((head, index) => (
                            <th
                                key={`${head}-${index}`}
                                className={`px-4 py-4 cursor-pointer text-gray-400 ${headerClassName}`}
                                onClick={() => handleSort(head)}
                                aria-sort={sortConfig?.column === head ? sortConfig.order : "none"}
                            >
                                {formatHeader(head)}
                                {sortConfig?.column === head && (
                                    <span className="ml-2">
                                        {sortConfig.order === "asc" ? "▲" : "▼"}
                                    </span>
                                )}
                            </th>
                        ))}
                        {ActionComponent && <th className={`px-4 py-4 ${headerClassName}`}>Actions</th>}
                    </tr>
                </thead>

                <tbody>
                    {currentRows.length > 0 ? (
                        currentRows.map((row, i) => (
                            <tr
                                key={`${row.id}-${i}`}
                                className="cursor-pointer hover:bg-gray-100"
                                onClick={() => onRowClick?.(row)}
                                aria-label={`Row ${i + 1}`}
                            >
                                {headers.map((header, index) => (
                                    <td
                                        className="w-[30ex] px-4 py-3 text-center"
                                        key={`${header}-${index}`}
                                    >
                                        {renderColumn
                                            ? renderColumn({
                                                column: header,
                                                value: row[header],
                                                row,
                                            })
                                            : row[header]}
                                    </td>
                                ))}
                                {ActionComponent && (
                                    <td className="px-4 py-3 text-center">
                                        <ActionComponent row={row} />
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={headers.length + (ActionComponent ? 1 : 0)} className="text-center py-4">
                                No results found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flex w-full h-full items-center justify-center gap-5 py-3">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                        key={number}
                        onClick={() => setCurrentPage(number)}
                        className={`${currentPage === number ? "bg-black text-white" : "border border-gray-300 text-black"
                            } size-8 rounded-md transition-all duration-300 cursor-pointer`}
                        aria-label={`Page ${number}`}
                    >
                        {number}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TableComponent;

const capitalizeFirstLetter = (str: string = "") => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const formatHeader = (header: string) => {
    return header
        .split("_")
        .map((word) => capitalizeFirstLetter(word))
        .join(" ");
};