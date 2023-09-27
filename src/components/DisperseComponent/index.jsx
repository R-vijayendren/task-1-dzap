"use client";

import React, { useMemo, useState } from "react";
import Textarea from "../Common/Textarea/Textarea";
import Button from "../Common/Button/Button";
import Info from "../Common/Icons/InfoIcon";

const getDetailsArray = (line) => {
  const delimiters = ["=", " ", ","];
  for (const delimiter of delimiters) {
    if (line.includes(delimiter)) {
      const [address, amount] = line.split(delimiter);
      return [address, amount, delimiter];
    }
  }
  return false;
};

function checkAddressUniqueness(lines) {
  const addressMap = new Map(); // Using a Map to store address as key and line numbers as values

  lines.forEach((line, lineNumber) => {
    const match = getDetailsArray(line);
    if (match) {
      const address = match[0];

      if (!addressMap.has(address)) {
        // Address is unique, initialize an array with the current line number
        addressMap.set(address, [lineNumber]);
      } else {
        // Address is a duplicate, add the current line number to the array
        addressMap.get(address).push(lineNumber);
      }
    }
  });

  return addressMap;
}

// Keep the first occurrence of a duplicate line and remove the remaining
const keepFirstOccurrence = (lines) => {
  const seenAddresses = new Set();
  const newLines = [];

  lines.forEach((line) => {
    const match = getDetailsArray(line);
    const address = match[0];

    if (!seenAddresses.has(address)) {
      seenAddresses.add(address);
      newLines.push(line);
    }
  });

  return newLines;
};

// Persist the address along with the delimiter and sum up the amount
const persistAddressAndSumAmount = (lines) => {
  const newLines = [];

  lines.forEach((line) => {
    const match = getDetailsArray(line);
    const address = match[0];
    const delimiter = match[2];
    const amount = parseInt(match[1]);

    const existingLine = newLines.find((line) => line.address === address);
    if (existingLine) {
      existingLine.amount += amount;
    } else {
      newLines.push({ address, delimiter, amount });
    }
  });

  return newLines.map(
    (line) => `${line.address}${line.delimiter}${line.amount}`
  );
};

const Disperse = ({ onSubmit }) => {
  const [lines, setLines] = useState([]);
  const [error, setError] = useState([]);
  const [dupeError, setDupeError] = useState([]);

  const validateInput = (input, i) => {
    const line = input.trim();
    const match = getDetailsArray(line);

    if (!match) {
      setError((prev) => [...prev, `Line ${i + 1} invalid delimiter.`]);
      return false;
    }

    const address = match[0];
    const amount = match[1];
    if (!address.startsWith("0x") && !Number.isInteger(Number(amount))) {
      setError((prev) => [
        ...prev,
        `Line ${i + 1} invalid Ethereum address and wrong amount.`,
      ]);
      return false;
    }
    if (!address.startsWith("0x")) {
      setError((prev) => [...prev, `Line ${i + 1} invalid Ethereum address.`]);
      return false;
    }
    if (!Number.isInteger(Number(amount))) {
      setError((prev) => [...prev, `Line ${i + 1} wrong amount.`]);
      return false;
    }
    return true;
  };

  const handleRemoveDuplicate = () => {
    const newLines = keepFirstOccurrence(lines);
    setLines(newLines);
    setError([]);
    setDupeError([]);
  };

  const handleCombineDuplicate = () => {
    const newLines = persistAddressAndSumAmount(lines);
    setLines(newLines);
    setError([]);
    setDupeError([]);
  };

  const handleUniqueValidation = (validLines) => {
    const result = checkAddressUniqueness(validLines);
    for (const [key, value] of result) {
      if (value.length > 1) {
        setDupeError((prev) => [
          ...prev,
          `${key} duplicate in Line: ${value.map((v) => v + 1)}`,
        ]);
      }
    }
    return true;
  };

  const onSubmitForm = (values) => {
    const validInputs = values.filter(validateInput);
    if (validInputs.length !== values.length) {
      return;
    } else {
      const isUnique = handleUniqueValidation(values);
      if (!isUnique) {
        return;
      }
      onSubmit(values);
    }
  };

  const customErr = useMemo(() => {
    return error.length > 0 ? error : dupeError;
  }, [dupeError, error]);

  const handleTextOnChange = (e) => {
    const lines = e.target.value.split("\n");
    setLines(lines);
    setError([]);
    setDupeError([]);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <p>Addresses with Amount</p>
        <div>
          <button onClick={() => {}}>Upload file</button>
        </div>
      </div>
      <Textarea
        value={lines.join("\n")}
        placeholder="Enter disperse addresses and amounts"
        handleOnChange={handleTextOnChange}
      />
      <div className="mt-2 flex justify-between">
        <p>
          Separated by &lsquo;,&rsquo; or &lsquo;=&rsquo; or &lsquo; &rsquo;
        </p>
        <div>
          <button onClick={() => {}}>Show Example</button>
        </div>
      </div>
      {dupeError.length > 0 ? (
        <div className="mt-4 flex justify-between">
          <p>
            <strong>Duplicated</strong>
          </p>
          <div className="text-red-500">
            <button onClick={handleRemoveDuplicate}>Keep the first one</button>{" "}
            | <button onClick={handleCombineDuplicate}>Combine balance</button>
          </div>
        </div>
      ) : null}
      {customErr.length > 0 ? (
        <div className="mt-4 border-2 rounded-md border-red-500 p-4 flex">
          <Info size={24} color="rgb(239 68 68 / 1)" />
          <div className="ml-2">
            {customErr.map((msg) => (
              <div key={msg} className="text-red-500">
                {msg}
              </div>
            ))}
          </div>
        </div>
      ) : null}
      <div className="mt-4 w-[100%]">
        <Button
          type="submit"
          handleOnClick={(e) => onSubmitForm(lines)}
          buttonText="Next"
          disabled={customErr.length > 0}
        />
      </div>
    </div>
  );
};

export default Disperse;
