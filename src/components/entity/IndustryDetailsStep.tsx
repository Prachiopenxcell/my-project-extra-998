import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus, ChevronDown, ChevronUp } from "lucide-react";

import { StepComponentProps, IndustryDetail } from "./types";

export const IndustryDetailsStep = ({ formData, updateFormData }: StepComponentProps): JSX.Element => {
  // Industry options (admin-defined)
  const industryOptions = [
    "Real Estate",
    "Finance",
    "Educational",
    "Service Sector",
    "Transportation",
    "Hotel",
    "Manufacturing",
    "Trading"
  ];

  // State for selected industries and expanded industry
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(formData.industries || []);
  const [expandedIndustry, setExpandedIndustry] = useState<string | null>(null);
  const [industryDetails, setIndustryDetails] = useState<IndustryDetail[]>(formData.industryDetails || []);

  // Employee counts
  const [maleEmployeeCount, setMaleEmployeeCount] = useState<number>(formData.maleEmployeeCount || 0);
  const [femaleEmployeeCount, setFemaleEmployeeCount] = useState<number>(formData.femaleEmployeeCount || 0);
  const [employeesForVDR, setEmployeesForVDR] = useState<number>(formData.employeesForVDR || 0);

  // State for operational status
  const [operationalStatus, setOperationalStatus] = useState<string>(formData.operationalStatus || "Active");
  
  // State for VDR-related fields
  const [installedCapacity, setInstalledCapacity] = useState<string>(formData.installedCapacity || "");
  const [salesQuantity, setSalesQuantity] = useState<string>(formData.salesQuantity || "");
  const [salesValue, setSalesValue] = useState<string>(formData.salesValue || "");

  // State for tags/keywords
  const [keyword, setKeyword] = useState("");
  const [keywords, setKeywords] = useState<string[]>(formData.keywords || []);

  // State for product input
  const [productInput, setProductInput] = useState<Record<string, string>>({});

  // Update total employee count when male or female counts change
  useEffect(() => {
    const totalCount = maleEmployeeCount + femaleEmployeeCount;
    updateFormData({ 
      maleEmployeeCount, 
      femaleEmployeeCount, 
      employeeCount: totalCount,
      employeesForVDR,
      installedCapacity,
      salesQuantity,
      salesValue
    });
  }, [maleEmployeeCount, femaleEmployeeCount, employeesForVDR, installedCapacity, salesQuantity, salesValue, updateFormData]);

  // Update operational status
  useEffect(() => {
    updateFormData({ operationalStatus });
  }, [operationalStatus, updateFormData]);

  // Handle adding a keyword
  const handleAddKeyword = () => {
    if (keyword && !keywords.includes(keyword)) {
      const updatedKeywords = [...keywords, keyword];
      setKeywords(updatedKeywords);
      updateFormData({ keywords: updatedKeywords });
      setKeyword("");
    }
  };

  // Handle removing a keyword
  const handleRemoveKeyword = (keywordToRemove: string) => {
    const updatedKeywords = keywords.filter(k => k !== keywordToRemove);
    setKeywords(updatedKeywords);
    updateFormData({ keywords: updatedKeywords });
  };

  // Handle key press for adding keywords
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  // Toggle industry selection
  const toggleIndustrySelection = (industry: string) => {
    let updated: string[];

    if (selectedIndustries.includes(industry)) {
      // Remove industry
      updated = selectedIndustries.filter(i => i !== industry);

      // Remove industry details
      const updatedDetails = industryDetails.filter(detail => detail.industry !== industry);
      setIndustryDetails(updatedDetails);
      updateFormData({ industryDetails: updatedDetails });

      // Clear expanded industry if it was the one removed
      if (expandedIndustry === industry) {
        setExpandedIndustry(null);
      }
    } else {
      // Add industry
      updated = [...selectedIndustries, industry];

      // Add empty industry details
      const newDetail: IndustryDetail = {
        industry,
        products: [],
        installedCapacity: "",
        salesQuantity: "",
        salesValue: "",
        employeesForVDR: 0
      };

      const updatedDetails = [...industryDetails, newDetail];
      setIndustryDetails(updatedDetails);
      updateFormData({ industryDetails: updatedDetails });

      // Initialize product input for this industry
      setProductInput(prev => ({ ...prev, [industry]: "" }));

      // Expand the newly added industry
      setExpandedIndustry(industry);
    }

    setSelectedIndustries(updated);
    updateFormData({ industries: updated });
  };

  // Toggle expanded industry
  const toggleExpandedIndustry = (industry: string) => {
    setExpandedIndustry(expandedIndustry === industry ? null : industry);
  };

  // Update industry detail
  const updateIndustryDetail = (industry: string, field: keyof IndustryDetail, value: string | number | string[]) => {
    const updatedDetails = industryDetails.map(detail => {
      if (detail.industry === industry) {
        return { ...detail, [field]: value };
      }
      return detail;
    });

    setIndustryDetails(updatedDetails);
    updateFormData({ industryDetails: updatedDetails });
  };

  // Add product to industry
  const addProduct = (industry: string) => {
    const product = productInput[industry];
    if (!product || !product.trim()) return;

    const updatedDetails = industryDetails.map(detail => {
      if (detail.industry === industry) {
        const products = detail.products || [];
        if (!products.includes(product)) {
          return { ...detail, products: [...products, product] };
        }
      }
      return detail;
    });

    setIndustryDetails(updatedDetails);
    updateFormData({ industryDetails: updatedDetails });

    // Clear product input
    setProductInput(prev => ({ ...prev, [industry]: "" }));
  };

  // Remove product from industry
  const removeProduct = (industry: string, product: string) => {
    const updatedDetails = industryDetails.map(detail => {
      if (detail.industry === industry && detail.products) {
        return { 
          ...detail, 
          products: detail.products.filter(p => p !== product) 
        };
      }
      return detail;
    });

    setIndustryDetails(updatedDetails);
    updateFormData({ industryDetails: updatedDetails });
  };

  // Get industry detail
  const getIndustryDetail = (industry: string): IndustryDetail | undefined => {
    return industryDetails.find(detail => detail.industry === industry);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {/* Industries Selection */}
        <div>
          <div className="space-y-2">
            <Label>Industries</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {industryOptions.map(industry => (
                <div key={industry} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`industry-${industry}`}
                    checked={selectedIndustries.includes(industry)} 
                    onCheckedChange={() => toggleIndustrySelection(industry)}
                  />
                  <Label htmlFor={`industry-${industry}`} className="cursor-pointer">{industry}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Industry Details Cards */}
        {selectedIndustries.length > 0 && (
          <div className="space-y-4">
            <Label>Industry Details</Label>
            {selectedIndustries.map(industry => {
              const detail = getIndustryDetail(industry);
              const isExpanded = expandedIndustry === industry;

              return (
                <Card key={industry} className="overflow-hidden">
                  <CardHeader 
                    className="cursor-pointer flex flex-row items-center justify-between p-4"
                    onClick={() => toggleExpandedIndustry(industry)}
                  >
                    <CardTitle className="text-lg">{industry}</CardTitle>
                    {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </CardHeader>

                  {isExpanded && (
                    <CardContent className="p-4 pt-0 space-y-4">
                      {/* Products/Services */}
                      <div className="space-y-2">
                        <Label>Products/Services</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            placeholder="Add product or service"
                            value={productInput[industry] || ""}
                            onChange={(e) => setProductInput(prev => ({ ...prev, [industry]: e.target.value }))}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addProduct(industry))}
                          />
                          <Button type="button" onClick={() => addProduct(industry)} size="sm">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {/* Display added products as badges */}
                        {detail?.products && detail.products.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {detail.products.map(product => (
                              <Badge key={product} className="flex items-center gap-1 px-3 py-1">
                                {product}
                                <X 
                                  className="h-3 w-3 cursor-pointer" 
                                  onClick={() => removeProduct(industry, product)}
                                />
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Installed Capacity */}
                      <div className="space-y-2">
                        <Label htmlFor={`capacity-${industry}`}>Installed Capacity</Label>
                        <Input
                          id={`capacity-${industry}`}
                          type="number"
                          min="0"
                          value={detail?.installedCapacity || 0}
                          onChange={(e) => updateIndustryDetail(industry, 'installedCapacity', parseInt(e.target.value) || 0)}
                          placeholder="Enter installed capacity"
                        />
                      </div>

                      {/* Sales Quantity */}
                      <div className="space-y-2">
                        <Label htmlFor={`sales-quantity-${industry}`}>Sales Quantity</Label>
                        <Input
                          id={`sales-quantity-${industry}`}
                          type="number"
                          min="0"
                          value={detail?.salesQuantity || 0}
                          onChange={(e) => updateIndustryDetail(industry, 'salesQuantity', parseInt(e.target.value) || 0)}
                          placeholder="Enter sales quantity"
                        />
                      </div>

                      {/* Sales Value */}
                      <div className="space-y-2">
                        <Label htmlFor={`sales-value-${industry}`}>Sales Value</Label>
                        <Input
                          id={`sales-value-${industry}`}
                          type="number"
                          min="0"
                          value={detail?.salesValue || 0}
                          onChange={(e) => updateIndustryDetail(industry, 'salesValue', parseInt(e.target.value) || 0)}
                          placeholder="Enter sales value"
                        />
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}

       
        
        {/* VDR Operational Details */}
        <div className="space-y-4 pt-4 border-t">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="installedCapacity">Installed Capacity</Label>
              <Input
                id="installedCapacity"
                value={installedCapacity}
                onChange={(e) => setInstalledCapacity(e.target.value)}
                placeholder="e.g., 1000 units/month"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="salesQuantity">Sales Quantity</Label>
              <Input
                id="salesQuantity"
                value={salesQuantity}
                onChange={(e) => setSalesQuantity(e.target.value)}
                placeholder="e.g., 800 units/month"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="salesValue">Sales Value</Label>
              <Input
                id="salesValue"
                value={salesValue}
                onChange={(e) => setSalesValue(e.target.value)}
                placeholder="e.g., ₹50,00,000"
              />
            </div>
          </div>
        </div>

        {/* Operational Status */}
        <div className="space-y-2 pt-4 border-t">
          <Label>Operational Status</Label>
          <RadioGroup
            value={operationalStatus}
            onValueChange={setOperationalStatus}
            className="flex flex-wrap gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Active" id="status-active" />
              <Label htmlFor="status-active">Active</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Inactive" id="status-inactive" />
              <Label htmlFor="status-inactive">Inactive</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Dormant" id="status-dormant" />
              <Label htmlFor="status-dormant">Dormant</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Under Liquidation" id="status-liquidation" />
              <Label htmlFor="status-liquidation">Under Liquidation</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Under CIRP" id="status-cirp" />
              <Label htmlFor="status-cirp">Under CIRP</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Keywords/Tags */}
        <div className="space-y-2 pt-4 border-t">
          <Label>Keywords/Tags</Label>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Add keyword or tag"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <Button type="button" onClick={handleAddKeyword} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {keywords.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {keywords.map(k => (
                <Badge key={k} className="flex items-center gap-1 px-3 py-1">
                  {k}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleRemoveKeyword(k)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Business Description */}
        <div className="space-y-2 pt-4 border-t">
          <Label htmlFor="additionalNotes">Business Description</Label>
          <Textarea
            id="additionalNotes"
            value={formData.additionalNotes || ""}
            onChange={(e) => updateFormData({ additionalNotes: e.target.value })}
            placeholder="Describe the business operations and activities"
            className="min-h-[100px]"
          />
        </div>
      </div>
    </div>
  );
};
