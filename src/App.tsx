import React, { useState, useEffect, useRef, useCallback } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import { InputNumber } from "primereact/inputnumber";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

interface ApiResponse {
  data: Artwork[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    total_pages: number;
    current_page: number;
  };
}

const App: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [first, setFirst] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(12);

  // We store only selected artwork IDs to persist selection across pages
  // without fetching or storing data from other pages
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [customSelectCount, setCustomSelectCount] = useState<
    number | null | undefined
  >(null);

  const overlayRef = useRef<OverlayPanel>(null);

  const fetchArtworks = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.artic.edu/api/v1/artworks?page=${page}`
      );
      const data: ApiResponse = await response.json();
      setArtworks(data.data);
      setTotalRecords(data.pagination.total);
      // Use actual rows per page from API response
      setRowsPerPage(data.pagination.limit);
    } catch (error) {
      console.error("Error fetching artworks:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const pageNumber = Math.floor(first / rowsPerPage) + 1;
    fetchArtworks(pageNumber);
  }, [first, rowsPerPage, fetchArtworks]);

  // Get currently selected artworks from the current page based on stored IDs
  const getSelectedArtworks = useCallback((): Artwork[] => {
    return artworks.filter((artwork) => selectedIds.has(artwork.id));
  }, [artworks, selectedIds]);

  const onSelectionChange = useCallback(
    (e: { value: Artwork[] }) => {
      const newSelection = e.value;
      const updatedSelectedIds = new Set(selectedIds);

      // Get all IDs from current page
      const currentPageIds = artworks.map((a) => a.id);

      // Remove all current page IDs first
      currentPageIds.forEach((id) => updatedSelectedIds.delete(id));

      // Add back the selected IDs from current page
      newSelection.forEach((artwork) => updatedSelectedIds.add(artwork.id));

      setSelectedIds(updatedSelectedIds);
    },
    [artworks, selectedIds]
  );

  const handleCustomSelection = () => {
    if (!customSelectCount || customSelectCount <= 0) {
      alert("Please enter a valid number");
      return;
    }

    const availableRows = artworks.length;
    const rowsToSelectCount = Math.min(customSelectCount, availableRows);

    // Inform user if they requested more than available on current page
    if (customSelectCount > availableRows) {
      alert(
        `Only ${availableRows} rows available on this page.\n` +
          `Selecting ${rowsToSelectCount} rows from current page only.`
      );
    }

    // Only select rows from the CURRENT PAGE
    const rowsToSelect = artworks.slice(0, rowsToSelectCount);

    const updatedSelectedIds = new Set(selectedIds);
    rowsToSelect.forEach((row) => updatedSelectedIds.add(row.id));

    setSelectedIds(updatedSelectedIds);
    overlayRef.current?.hide();
    setCustomSelectCount(null);
  };

  const onPageChange = useCallback((event: any) => {
    setFirst(event.first);
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Artwork Gallery
            </h1>
            <div className="flex gap-3 items-center">
              <span className="text-sm font-medium text-gray-600">
                Selected: {selectedIds.size} rows
              </span>
              <Button
                label="Custom Select"
                icon="pi pi-check-square"
                onClick={(e) => overlayRef.current?.toggle(e)}
                className="p-button-outlined"
              />
              <OverlayPanel ref={overlayRef}>
                <div className="flex flex-col gap-3 p-2">
                  <label className="font-semibold text-sm">
                    Select Number of Rows (Current Page):
                  </label>
                  <InputNumber
                    value={customSelectCount}
                    onValueChange={(e) => setCustomSelectCount(e.value)}
                    placeholder="Enter count"
                    min={1}
                    max={artworks.length}
                    className="w-full"
                  />
                  <Button
                    label="Submit"
                    icon="pi pi-check"
                    onClick={handleCustomSelection}
                    className="w-full"
                  />
                </div>
              </OverlayPanel>
            </div>
          </div>

          <DataTable
            value={artworks}
            loading={loading}
            paginator
            lazy
            rows={rowsPerPage}
            totalRecords={totalRecords}
            first={first}
            onPage={onPageChange}
            selection={getSelectedArtworks()}
            onSelectionChange={onSelectionChange}
            selectionMode="checkbox"
            dataKey="id"
            rowHover
            responsiveLayout="scroll"
            className="p-datatable-striped"
            emptyMessage="No artworks found"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          >
            <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
            <Column
              field="title"
              header="Title"
              style={{ minWidth: "200px" }}
              body={(rowData: Artwork) => (
                <div className="font-medium">{rowData.title || "Untitled"}</div>
              )}
            />
            <Column
              field="place_of_origin"
              header="Place of Origin"
              style={{ minWidth: "150px" }}
              body={(rowData: Artwork) => (
                <div>{rowData.place_of_origin || "Unknown"}</div>
              )}
            />
            <Column
              field="artist_display"
              header="Artist"
              style={{ minWidth: "200px" }}
              body={(rowData: Artwork) => (
                <div className="text-sm">
                  {rowData.artist_display || "Unknown"}
                </div>
              )}
            />
            <Column
              field="inscriptions"
              header="Inscriptions"
              style={{ minWidth: "200px" }}
              body={(rowData: Artwork) => (
                <div className="text-sm truncate">
                  {rowData.inscriptions || "None"}
                </div>
              )}
            />
            <Column
              field="date_start"
              header="Date Start"
              style={{ minWidth: "120px" }}
            />
            <Column
              field="date_end"
              header="Date End"
              style={{ minWidth: "120px" }}
            />
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default App;
