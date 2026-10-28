import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Badge } from "../../../../components/ui/UI";
import ChoiceDialog from "../../../../components/ChoiceDialog";
import { updateStatusJobSheets } from "../../../../services/apiServices/jobSheetService";

const statuses = [
  { value: "Open", colour: "#3157d5", background: "#eff4ff" },
  { value: "In Progress", colour: "#b54708", background: "#fffaeb" },
  { value: "Completed", colour: "#079455", background: "#ecfdf3" },
  { value: "Cancelled", colour: "#d92d20", background: "#fef3f2" },
];

export default function StatusUpdate({ title, jobSheetsList, id }) {
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(title);
  const [saving, setSaving] = useState(false);

  useEffect(() => setSelectedStatus(title), [title]);

  const handleClose = () => {
    if (saving) return;
    setOpen(false);
    setSelectedStatus(title);
  };

  const handleUpdate = async () => {
    if (!selectedStatus) return toast.error("Please select a status");
    setSaving(true);
    try {
      const response = await updateStatusJobSheets(id, { status: selectedStatus });
      if (response?.success) {
        toast.success(response.message || "Job status updated");
        jobSheetsList();
        setOpen(false);
      } else {
        toast.error(response?.message || "Unable to update job status");
      }
    } catch (error) {
      toast.error(error?.message || "Unable to update job status");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="rounded-full text-left" aria-label={`Change status from ${title}`}>
        <Badge status={title} />
      </button>
      <ChoiceDialog
        open={open}
        title="Change job status"
        description="Select the current workshop stage for this job sheet."
        options={statuses}
        value={selectedStatus}
        onChange={setSelectedStatus}
        onClose={handleClose}
        onConfirm={handleUpdate}
        saving={saving}
        confirmText="Update status"
      />
    </>
  );
}
