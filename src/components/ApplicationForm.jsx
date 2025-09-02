"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { toast } from "sonner";
import { domain, positions } from "@/lib/consts";
import { useTranslations } from "next-intl";

const roles = positions;

export function ApplicationForm() {
  const t = useTranslations("Career");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const res = await fetch(`${domain}career`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: formData.name, // ✅ state string
        email: formData.email, // ✅ state string
        phone: formData.phone, // ✅ state string
        position: formData.role,
        message: formData.message
      })
    });

    if (res.status == 201) {
      toast(`${t("toast1")}`);
    }

    setFormData({ name: "", email: "", phone: "", role: "", message: "" });
    setIsSubmitting(false);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-6 text-balance">
            {t("ready_to_join")}
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            {t("ready_des")}
          </p>
        </div>

        <Card className="border-border shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {t("app_form")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("full_name")}*</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder=""
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                    className="border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("email_address")}*</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder=""
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    className="border-border"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">{t("phone_number")} *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder=""
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                    className="border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">{t("position")} *</Label>
                  <Select
                    value={formData.role}
                    className="w-full"
                    onValueChange={(value) => handleInputChange("role", value)}
                  >
                    <SelectTrigger className="border-border w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">{t("tell_us")}</Label>
                <Textarea
                  id="message"
                  placeholder=""
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  rows={5}
                  className=" border-border resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-700 hover:bg-blue-800  text-white py-3 text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? `${t("submiting")}` : `${t("submit")}`}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
