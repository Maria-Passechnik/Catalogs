import React from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
} from "@mui/material";

import { useFormik } from "formik";
import {
  catalogFormSchema,
  CatalogFormSchema,
} from "../../../validations/catalogForm";
import {
  LocalesField,
  NameField,
  PrimaryCheckbox,
  VerticalField,
} from "./CatalogFields";

interface CatalogModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
}

export const CatalogModal: React.FC<CatalogModalProps> = ({
  open,
  onClose,
  onSave,
  initialData,
}) => {
  const formik = useFormik({
    initialValues: {
      name: initialData?.name || "",
      vertical: initialData?.vertical || "",
      locales: initialData?.locales || [],
      isPrimary: initialData?.isPrimary || false,
    },
    validationSchema: catalogFormSchema,
    onSubmit: (values: CatalogFormSchema) => {
      onSave(values);
      formik.resetForm();
      onClose();
    },
    enableReinitialize: true,
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle variant="h6" fontWeight="bold">
        {initialData ? "Edit Catalog" : "Add Catalog"}
      </DialogTitle>
      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <NameField formik={formik} />
          <VerticalField formik={formik} />
          <LocalesField formik={formik} />
          <PrimaryCheckbox formik={formik} />
        </form>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>Cancel</Button>
        <Button
          onClick={formik.submitForm}
          variant="outlined"
          disabled={!formik.isValid || formik.isSubmitting}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
