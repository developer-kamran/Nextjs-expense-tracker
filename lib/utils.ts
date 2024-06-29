import { Dispatch, SetStateAction, RefObject } from 'react';

export function format(x: number): string {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export const handleClickOutside = (
  dialogRef: RefObject<HTMLDivElement>,
  setShowDialog: Dispatch<SetStateAction<boolean>>
) => {
  return (event: MouseEvent) => {
    if (
      dialogRef.current &&
      !dialogRef.current.contains(event.target as Node)
    ) {
      setShowDialog(false);
    }
  };
};
