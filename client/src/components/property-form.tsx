import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import type { PropertyFormData } from "@/lib/types";

const formSchema = z.object({
  propertyDescription: z.string().min(10, "Property description must be at least 10 characters"),
  acreage: z.number().min(0.1, "Acreage must be greater than 0"),
  location: z.string().min(2, "Location is required"),
  irrigated: z.boolean().default(false),
  tillable: z.boolean().default(false),
  cropType: z.string().optional(),
});

interface PropertyFormProps {
  onSubmit: (data: PropertyFormData) => void;
  isLoading: boolean;
}

export function PropertyForm({ onSubmit, isLoading }: PropertyFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyDescription: "",
      acreage: 0,
      location: "",
      irrigated: false,
      tillable: false,
      cropType: "",
    },
  });

  const fillExample = (exampleData: Partial<PropertyFormData>) => {
    Object.entries(exampleData).forEach(([key, value]) => {
      setValue(key as keyof PropertyFormData, value);
    });
  };

  const example1 = {
    propertyDescription: "160 acres of irrigated corn ground in Hamilton County, Nebraska",
    acreage: 160,
    location: "Hamilton County, NE",
    irrigated: true,
    tillable: true,
    cropType: "corn",
  };

  const example2 = {
    propertyDescription: "80 acres dryland farmland near Hastings, NE",
    acreage: 80,
    location: "Hastings, NE",
    irrigated: false,
    tillable: true,
    cropType: "wheat",
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">Property Details</CardTitle>
        <CardDescription>
          Enter your property information to get a real-time valuation estimate.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Property Description */}
          <div className="space-y-2">
            <Label htmlFor="propertyDescription" className="text-sm font-medium text-gray-700">
              Property Description
            </Label>
            <Textarea
              id="propertyDescription"
              {...register("propertyDescription")}
              placeholder="e.g., 120 acres of irrigated farmland near Kearney, Nebraska"
              rows={4}
              className="resize-none"
            />
            {errors.propertyDescription && (
              <p className="text-xs text-red-600">{errors.propertyDescription.message}</p>
            )}
            <p className="text-xs text-gray-500">
              Describe your land including location, acreage, and key features
            </p>
          </div>

          {/* Quick Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="acreage" className="text-sm font-medium text-gray-700">
                Acreage
              </Label>
              <Input
                id="acreage"
                type="number"
                step="0.1"
                {...register("acreage", { valueAsNumber: true })}
                placeholder="120"
              />
              {errors.acreage && (
                <p className="text-xs text-red-600">{errors.acreage.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                Location
              </Label>
              <Input
                id="location"
                {...register("location")}
                placeholder="Buffalo County, NE"
              />
              {errors.location && (
                <p className="text-xs text-red-600">{errors.location.message}</p>
              )}
            </div>
          </div>

          {/* Feature Toggles */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Property Features</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="irrigated"
                  checked={watch("irrigated")}
                  onCheckedChange={(checked) => setValue("irrigated", !!checked)}
                />
                <Label htmlFor="irrigated" className="text-sm text-gray-700 cursor-pointer">
                  Irrigated
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="tillable"
                  checked={watch("tillable")}
                  onCheckedChange={(checked) => setValue("tillable", !!checked)}
                />
                <Label htmlFor="tillable" className="text-sm text-gray-700 cursor-pointer">
                  Tillable
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cropType" className="text-sm font-medium text-gray-700">
                Primary Crop Type
              </Label>
              <Select onValueChange={(value) => setValue("cropType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select crop type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Select crop type</SelectItem>
                  <SelectItem value="corn">Corn</SelectItem>
                  <SelectItem value="soybeans">Soybeans</SelectItem>
                  <SelectItem value="wheat">Wheat</SelectItem>
                  <SelectItem value="alfalfa">Alfalfa</SelectItem>
                  <SelectItem value="pasture">Pasture</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Analyzing Property...
              </>
            ) : (
              <>
                Get Valuation
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          {/* Quick Examples */}
          <Card className="bg-gray-50">
            <CardContent className="pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Example Inputs:</h4>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => fillExample(example1)}
                  className="block text-left text-sm text-gray-600 hover:text-primary transition-colors"
                >
                  "160 acres of irrigated corn ground in Hamilton County, Nebraska"
                </button>
                <button
                  type="button"
                  onClick={() => fillExample(example2)}
                  className="block text-left text-sm text-gray-600 hover:text-primary transition-colors"
                >
                  "80 acres dryland farmland near Hastings, NE"
                </button>
              </div>
            </CardContent>
          </Card>
        </form>
      </CardContent>
    </Card>
  );
}
