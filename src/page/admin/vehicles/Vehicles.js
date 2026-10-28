import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  RiAddLine,
  RiDeleteBinLine,
  RiEditLine,
  RiSearchLine,
} from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import {
  BtnBlue,
  Card,
  LoadingState,
  PageHeader,
  Pagination,
  RegPlate,
  Table,
} from "../../../components/ui/UI";
import ConfirmDialog from "../../../components/ConfirmDialog";
import useDebounce from "../../../components/useDebounce";
import {
  deleteVehicles,
  fetchVehicles,
} from "../../../services/apiServices/vehicleService";

export default function Vehicles() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0, limit: 20 });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const query = useDebounce(search);

  const load = useCallback(
    async (page = 1) => {
      setLoading(true);
      const response = await fetchVehicles({ search: query, page, limit: 20 });
      if (response?.success) {
        setRecords(response.data || []);
        setMeta(
          response.meta || {
            page,
            pages: 1,
            total: response.data?.length || 0,
            limit: 20,
          },
        );
      } else toast.error(response?.message || "Unable to load vehicles");
      setLoading(false);
    },
    [query],
  );
  useEffect(() => {
    load(1);
  }, [load]);

  const remove = async () => {
    const response = await deleteVehicles(deleteId);
    if (response?.success) {
      toast.success(response.message || "Vehicle deleted");
      setDeleteId(null);
      load(meta.page);
    } else toast.error(response?.message || "Unable to delete vehicle");
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Vehicles"
        sub={`${meta.total || 0} registered vehicles`}
        action={
          <BtnBlue
            onClick={() =>
              navigate("/vehicles/new", { state: { from: "/vehicles" } })
            }
          >
            <RiAddLine /> Add vehicle
          </BtnBlue>
        }
      />
      <Card className="overflow-hidden">
        <div className="pw-list-toolbar">
          <div className="pw-search-box">
            <RiSearchLine />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search registration, make, model or VIN"
            />
          </div>
        </div>
        {loading ? (
          <LoadingState label="Loading vehicles…" />
        ) : (
          <>
            <div className="pw-mobile-records">
              {records.map((v) => (
                <article className="pw-record-card" key={v.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <RegPlate reg={v.registrationNumber} />
                      <h3 className="mt-3">
                        {v.make} {v.model}
                      </h3>
                      <p>{v.year || "Year not set"}</p>
                    </div>
                    <span className="pw-avatar">
                      {String(v.make || "V")
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>
                  </div>
                  <div className="pw-record-details">
                    <span>Owner: {v.customer?.name || "Unassigned"}</span>
                    <span>Mileage: {v.mileage ?? "—"}</span>
                    <span>VIN: {v.vinNumber || "—"}</span>
                  </div>
                  <div className="pw-record-actions">
                    <button
                      onClick={() =>
                        navigate(`/vehicles/${v.id}/edit`, {
                          state: { record: v, from: "/vehicles" },
                        })
                      }
                    >
                      <RiEditLine /> Edit
                    </button>
                    <button
                      className="danger"
                      onClick={() => setDeleteId(v.id)}
                    >
                      <RiDeleteBinLine /> Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <div className="pw-desktop-table">
              <Table
                headers={[
                  "Owner",
                  "Registration",
                  "Vehicle",
                  "Year",
                  "VIN",
                  "Mileage",
                  "Actions",
                ]}
                empty={!records.length ? "No vehicles found" : null}
              >
                {records.map((v) => (
                  <tr key={v.id}>
                    <td className="font-semibold">{v.customer?.name || "—"}</td>
                    <td>
                      <RegPlate reg={v.registrationNumber} />
                    </td>
                    <td>
                      <strong>{v.make}</strong>
                      <div className="text-xs text-slate-400">{v.model}</div>
                    </td>
                    <td>{v.year || "—"}</td>
                    <td className="font-mono text-xs">{v.vinNumber || "—"}</td>
                    <td>{v.mileage ?? "—"}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          className="pw-icon-button"
                          onClick={() =>
                            navigate(`/vehicles/${v.id}/edit`, {
                              state: { record: v, from: "/vehicles" },
                            })
                          }
                        >
                          <RiEditLine />
                        </button>
                        <button
                          className="pw-icon-button pw-icon-button--danger"
                          onClick={() => setDeleteId(v.id)}
                        >
                          <RiDeleteBinLine />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </Table>
            </div>
            <Pagination meta={meta} disabled={loading} onPageChange={load} />
          </>
        )}
      </Card>
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete vehicle?"
        message="The vehicle record will be permanently removed. Linked workshop records may prevent deletion."
        confirmText="Delete vehicle"
        cancelText="Keep record"
        onConfirm={remove}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}
