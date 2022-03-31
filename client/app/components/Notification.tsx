import { Notification as MantineNotification } from "@mantine/core";
import { Session } from "@remix-run/server-runtime/sessions";
import { useCallback, useEffect, useState } from "react";

type Severity = "error" | "warning" | "info" | "success";
export interface NotificationProps {
  severity: Severity;
  title: string;
  message: string;
}

export const createNotification = (
  session: Session,
  options: NotificationProps
) => {
  session.flash("notification", JSON.stringify(options));
};

const resolveColor = (severity: Severity) => {
  switch (severity) {
    case "error":
      return "red";
    case "info":
      return "blue";
    case "success":
      return "green";
    case "warning":
      return "yellow";
  }
};

export const Notification = ({
  severity,
  title,
  message,
}: NotificationProps) => {
  const [hideNotification, setHideNotification] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHideNotification(true);
    }, 10000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleClose = useCallback(() => {
    setHideNotification(true);
  }, []);

  if (hideNotification) {
    return null;
  }

  return (
    <MantineNotification
      title={title}
      color={resolveColor(severity)}
      onClose={handleClose}
      sx={{
        position: "absolute",
        width: 450,
        left: "50%",
        transform: "translateX(-50%)",
      }}
      closeButtonProps={{ "aria-label": "Hide notification" }}
    >
      {message}
    </MantineNotification>
  );
};
