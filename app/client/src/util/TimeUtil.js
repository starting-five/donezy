// File: client/util/TimeUtil.js
// Description: Utility functions to handle time and date operations

export const getLocalTimeZoneAbbreviation = () =>{
  const date = new Date();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "short",
  });

  const parts = formatter.formatToParts(date);
  const tzPart = parts.find((part) => part.type === "timeZoneName");

  return tzPart ? tzPart.value : timeZone; // fallback to full name
}