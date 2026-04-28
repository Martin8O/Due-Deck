import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, addYears, subYears } from "date-fns";
import { CalendarIcon, ChevronsLeft, ChevronsRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import type { Item } from "@/lib/types";

export function ItemDialog({
  open,
  onOpenChange,
  editing,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing?: Item | null;
}) {
  const { data, addItem, updateItem, deleteItem } = useStore();
  const { t } = useI18n();

  const schema = React.useMemo(
    () =>
      z.object({
        name: z.string().min(1, t("val.name")),
        categoryId: z.string().min(1, t("val.category")),
        expiryDate: z.string().min(1, t("val.expiry")),
        startDate: z.string().optional(),
        paymentDate: z.string().optional(),
        price: z.string().optional(),
        currency: z.string().optional(),
        note: z.string().optional(),
        link: z.string().optional(),
        tags: z.string().optional(),
        recurring: z.enum(["none", "yearly", "quarterly", "monthly"]),
      }),
    [t],
  );

  type FormValues = z.infer<typeof schema>;

  const defaults: FormValues = React.useMemo(
    () => ({
      name: editing?.name ?? "",
      categoryId: editing?.categoryId ?? data.categories[0]?.id ?? "other",
      expiryDate: editing?.expiryDate ?? "",
      startDate: editing?.startDate ?? "",
      paymentDate: editing?.paymentDate ?? "",
      price: editing?.price?.toString() ?? "",
      currency: editing?.currency ?? "Kč",
      note: editing?.note ?? "",
      link: editing?.link ?? "",
      tags: editing?.tags?.join(", ") ?? "",
      recurring: editing?.recurring ?? "none",
    }),
    [editing, data.categories],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  });

  React.useEffect(() => {
    if (open) form.reset(defaults);
  }, [open, defaults, form]);

  const onSubmit = (values: FormValues) => {
    const tags =
      values.tags
        ?.split(",")
        .map((t) => t.trim())
        .filter(Boolean) ?? [];
    const payload = {
      name: values.name.trim(),
      categoryId: values.categoryId,
      expiryDate: values.expiryDate,
      startDate: values.startDate || undefined,
      paymentDate: values.recurring !== "none" ? values.paymentDate || undefined : undefined,
      price: values.price ? Number(values.price.replace(",", ".")) : undefined,
      currency: values.currency || undefined,
      note: values.note?.trim() || undefined,
      link: values.link?.trim() || undefined,
      tags: tags.length ? tags : undefined,
      recurring: values.recurring,
    };
    if (editing) updateItem(editing.id, payload);
    else addItem(payload);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>{editing ? t("dlg.edit") : t("dlg.new")}</DialogTitle>
          <DialogDescription>{t("dlg.desc")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("field.name")}</Label>
            <Input id="name" placeholder={t("field.name_ph")} {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("field.category")}</Label>
              <Controller
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("field.category_ph")} />
                    </SelectTrigger>
                    <SelectContent>
                      {data.categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          <span className="mr-2">{c.icon}</span>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>{t("field.recurring")}</Label>
              <Controller
                control={form.control}
                name="recurring"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">{t("rec.none")}</SelectItem>
                      <SelectItem value="monthly">{t("rec.monthly")}</SelectItem>
                      <SelectItem value="quarterly">{t("rec.quarterly")}</SelectItem>
                      <SelectItem value="yearly">{t("rec.yearly")}</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Controller
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <DateField
                  label={t("field.start")}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <DateField
                  label={t("field.expiry")}
                  value={field.value}
                  onChange={field.onChange}
                  error={form.formState.errors.expiryDate?.message}
                />
              )}
            />
          </div>

          {form.watch("recurring") !== "none" && (
            <div className="rounded-lg border border-dashed border-border bg-muted/30 p-3">
              <Controller
                control={form.control}
                name="paymentDate"
                render={({ field }) => (
                  <DateField
                    label={t("field.payment")}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <p className="mt-2 text-xs text-muted-foreground">{t("field.payment_hint")}</p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="price">{t("field.price")}</Label>
              <Input id="price" inputMode="decimal" placeholder="0" {...form.register("price")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">{t("field.currency")}</Label>
              <Input id="currency" placeholder="Kč" {...form.register("currency")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="link">{t("field.link")}</Label>
            <Input id="link" placeholder="https://…" {...form.register("link")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">{t("field.tags")}</Label>
            <Input id="tags" placeholder={t("field.tags_ph")} {...form.register("tags")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">{t("field.note")}</Label>
            <Textarea id="note" rows={3} {...form.register("note")} />
          </div>

          <DialogFooter className="gap-2 sm:justify-between">
            <div>
              {editing && (
                <Button
                  type="button"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => {
                    deleteItem(editing.id);
                    onOpenChange(false);
                  }}
                >
                  {t("common.delete")}
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t("common.cancel")}
              </Button>
              <Button type="submit">{editing ? t("common.save") : t("common.add")}</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DateField({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string | undefined;
  onChange: (v: string) => void;
  error?: string;
}) {
  const { t, locale } = useI18n();
  const date = value ? new Date(value + "T00:00:00") : undefined;
  const [month, setMonth] = React.useState<Date>(date ?? new Date());

  React.useEffect(() => {
    if (date) setMonth(date);
  }, [value]);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "d. M. yyyy") : <span>{t("date.pick")}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex items-center justify-between gap-1 border-b border-border px-2 py-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setMonth((m) => subYears(m, 1))}
              title="−1 rok"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs font-medium text-muted-foreground">
              {format(month, "yyyy")}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setMonth((m) => addYears(m, 1))}
              title="+1 rok"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
          <Calendar
            mode="single"
            selected={date}
            month={month}
            onMonthChange={setMonth}
            onSelect={(d) => onChange(d ? format(d, "yyyy-MM-dd") : "")}
            captionLayout="dropdown"
            startMonth={new Date(1970, 0)}
            endMonth={new Date(2100, 11)}
            locale={locale}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
