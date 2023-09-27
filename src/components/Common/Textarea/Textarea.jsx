import React from "react";

const Textarea = ({
  handleOnChange = () => {},
  value,
  rows = "10",
  placeholder = "",
}) => {
  return (
    <div className="flex bg-black py-4 px-2 rounded-md">
      <div className="w-10 text-gray-600 text-right pr-2 border-r-2 border-gray-600">
        {value.split("\n").map((line, index) => (
          <div key={index}>{index + 1}</div>
        ))}
      </div>
      <textarea
        className="flex-grow border-none bg-transparent outline-none px-2 text-slate-100 resize-none"
        value={value}
        onChange={handleOnChange}
        rows={rows}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Textarea;
