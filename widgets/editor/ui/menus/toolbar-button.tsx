import { Box, ButtonProps, Chip, IconButton, Tooltip } from "@mui/material";
import React from "react"

export type ToolbarButtonProps = ButtonProps & {
  active?: boolean;
  activeClassname?: string;
  tooltip?: string;
  tooltipShortcut?: string[];
};

export const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(({ children, tooltip, tooltipShortcut, ...props }, ref) => {
  const button = <IconButton
    ref={ref}
    sx={{ border: "none" }}
    {...props}
  >
    {children}
  </IconButton>

  if (!tooltip) {
    return button
  }

  let shortcut = null

  if (Array.isArray(tooltipShortcut) && tooltipShortcut.length) {
    shortcut = tooltipShortcut.map((title, index) => <>
      {index == 0 && "\u00A0"}
      {index != 0 && "\u00A0+\u00A0"}
      <Chip size="small" label={title} />
    </>)
  }

  return <Tooltip title={<Box sx={{ display: "flex", alignItems: "center" }}>{tooltip}{shortcut}</Box>}>
    {button}
  </Tooltip>

})
