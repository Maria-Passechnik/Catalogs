import {
  Box,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Select,
  FormControl,
  ListItemText,
} from "@mui/material";
import { InputLabel } from "../../Common/InputLabel";
import {
  localeOptions,
  verticalOptions,
} from "../../../validations/catalogForm";

export const NameField = ({ formik }: { formik: any }) => (
  <Box>
    <InputLabel label="Name" />
    <TextField
      id="name"
      name="name"
      value={formik.values.name}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={formik.touched.name && Boolean(formik.errors.name)}
      helperText={formik.touched.name && formik.errors.name}
      fullWidth
      required
    />
  </Box>
);

export const VerticalField = ({ formik }: { formik: any }) => (
  <Box>
    <InputLabel label="Vertical" />
    <TextField
      id="vertical"
      select
      name="vertical"
      value={formik.values.vertical}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={formik.touched.vertical && Boolean(formik.errors.vertical)}
      helperText={formik.touched.vertical && formik.errors.vertical}
      fullWidth
      required
    >
      {verticalOptions.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  </Box>
);

export const LocalesField = ({ formik }: { formik: any }) => (
  <Box>
    <InputLabel label="Locales" />
    <FormControl
      fullWidth
      error={formik.touched.locales && Boolean(formik.errors.locales)}
    >
      <Select
        labelId="locales-label"
        id="locales"
        multiple
        name="locales"
        value={formik.values.locales}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        renderValue={(selected) => (selected as string[]).join(", ")}
      >
        {localeOptions.map((locale) => (
          <MenuItem key={locale} value={locale}>
            <Checkbox checked={formik.values.locales?.includes(locale)} />
            <ListItemText primary={locale} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    {formik.touched.locales && formik.errors.locales && (
      <Box color="error.main" mt={1}>
        {formik.errors.locales}
      </Box>
    )}
  </Box>
);

export const PrimaryCheckbox = ({ formik }: { formik: any }) => (
  <Box>
    <InputLabel label="Primary" />
    <FormControlLabel
      control={
        <Checkbox
          id="isPrimary"
          name="isPrimary"
          checked={formik.values.isPrimary}
          onChange={formik.handleChange}
        />
      }
      label="Is this the primary catalog?"
    />
  </Box>
);
