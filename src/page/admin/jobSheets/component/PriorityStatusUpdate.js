import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Badge } from "../../../../components/ui/UI";
import ChoiceDialog from "../../../../components/ChoiceDialog";
import { updatePriorityStatusJobSheets } from "../../../../services/apiServices/jobSheetService";

const priorities = [
  { value: "Low", colour: "#079455", background: "#ecfdf3" },
  { value: "Medium", colour: "#3157d5", background: "#eff4ff" },
  { value: "High", colour: "#b54708", background: "#fff3e6" },
  { value: "Urgent", colour: "#d92d20", background: "#fef3f2" },
];

export default function PriorityStatusUpdate({ title, jobSheetsList, id }) {
  const [open, setOpen] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState(title);
  const [saving, setSaving] = useState(false);

  useEffect(() => setSelectedPriority(title), [title]);

  const handleClose = () => {
    if (saving) return;
    setOpen(false);
    setSelectedPriority(title);
  };

  const handleUpdate = async () => {
    if (!selectedPriority) return toast.error("Please select a priority");
    setSaving(true);
    try {
      const response = await updatePriorityStatusJobSheets(id, { priority: selectedPriority });
      if (response?.success) {
        toast.success(response.message || "Priority updated");
        jobSheetsList();
        setOpen(false);
      } else {
        toast.error(response?.message || "Unable to update priority");
      }
    } catch (error) {
      toast.error(error?.message || "Unable to update priority");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="rounded-full text-left" aria-label={`Change priority from ${title}`}>
        <Badge status={title} />
      </button>
      <ChoiceDialog
        open={open}
        title="Change job priority"
        description="Set how urgently the workshop should handle this job."
        options={priorities}
        value={selectedPriority}
        onChange={setSelectedPriority}
        onClose={handleClose}
        onConfirm={handleUpdate}
        saving={saving}
        confirmText="Update priority"
      />
    </>
  );
}
