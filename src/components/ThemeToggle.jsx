function ThemeToggle({ dark, onToggle }) {
  return (
    <div className="flex items-center gap-3">
      <label className="flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={dark}
          onChange={onToggle}
          className="hidden"
        />

        <div className="w-12 h-6 bg-gray-400 rounded-full relative">
          <div
            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${
              dark ? "translate-x-6" : ""
            }`}
          ></div>
        </div>
      </label>

      <span className="font-medium">
        {dark ? "Dark Mode" : "Light Mode"}
      </span>
    </div>
  );
}

export default ThemeToggle;