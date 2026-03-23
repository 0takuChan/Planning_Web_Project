import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";

const NEW_BADGE_VISIBLE_MS = 24 * 60 * 60 * 1000;

type NewShipmentBadgeProps = {
  shipmentNumber: string;
  createdAt?: string | null;
};

const parseShipmentNumberDate = (shipmentNumber: string): Date | null => {
  const match = shipmentNumber.match(/^SM(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})\d+TH$/);

  if (!match) {
    return null;
  }

  const [, day, month, year, hour, minute, second] = match;
  const parsedDate = new Date(
    Number(`20${year}`),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second)
  );

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

export const getShipmentCreatedDate = (
  shipmentNumber: string,
  createdAt?: string | null
): Date | null => {
  if (createdAt) {
    const parsedCreatedAt = new Date(createdAt);

    if (!Number.isNaN(parsedCreatedAt.getTime())) {
      return parsedCreatedAt;
    }
  }

  return parseShipmentNumberDate(shipmentNumber);
};

export const isShipmentNew = (shipmentNumber: string, createdAt?: string | null): boolean => {
  const createdDate = getShipmentCreatedDate(shipmentNumber, createdAt);

  if (!createdDate) {
    return false;
  }

  const elapsedMs = Date.now() - createdDate.getTime();

  return elapsedMs >= 0 && elapsedMs < NEW_BADGE_VISIBLE_MS;
};

export default function NewShipmentBadge({ shipmentNumber, createdAt }: NewShipmentBadgeProps) {
  if (!isShipmentNew(shipmentNumber, createdAt)) {
    return null;
  }

  return (
    <Badge className="gap-1 border-0 bg-emerald-500 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:bg-emerald-500">
      <Sparkles className="h-3 w-3" />
      New
    </Badge>
  );
}