export default function SaveCancelBtns({ onClick, isPending }) {
  return (
    <div className="flex flex-row gap-1">
      <button
        id="saveBtn"
        onClick={onClick}
        className="flex flex-row justify-center items-center gap-1 text-white bg-blue-500 px-2 rounded-2xl"
      >
        <p className="text-[9pt] cursor-pointer">
          {isPending ? 'Saving...' : 'Save'}
        </p>
      </button>
      <button
        id="cancelBtn"
        onClick={() => setIsEditingNotes(false)}
        className="flex flex-row justify-center items-center gap-1 text-red-500 bg-white border border-red-400 px-2 rounded-2xl"
      >
        <p className="text-[9pt] cursor-pointer">Cancel</p>
      </button>
    </div>
  );
}
