import React from "react";

const Button = ({
  type = "",
  handleOnClick = () => {},
  buttonText = "",
  disabled,
}) => {
  return (
    <button
      type={type}
      className="bg-gradient-to-r from-purple-500 to-violet-600 hover:bg-violet-600 text-white py-2 px-4 rounded-full h-[50px] w-[100%] disabled:bg-black disabled:cursor-not-allowed"
      onClick={handleOnClick}
      disabled={disabled}
    >
      {buttonText}
    </button>
  );
};

export default Button;
