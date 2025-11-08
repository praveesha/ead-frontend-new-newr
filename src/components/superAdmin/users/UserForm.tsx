import {
  Paper,
  Typography,
  Stack,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { Formik, Form } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";

interface UserFormValues {
  email: string;
  password: string;
  confirmPassword: string;
  role: "ADMIN" | "EMPLOYEE" | "";
}

interface UserFormProps {
  onSubmit: (
    values: UserFormValues,
    formikHelpers: FormikHelpers<UserFormValues>
  ) => Promise<void>;
}

// Validation Schema
const userValidationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address"
    ),
  password: Yup.string()
    .min(4, "Password must be at least 4 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  role: Yup.string()
    .oneOf(["ADMIN", "EMPLOYEE"], "Please select a valid role")
    .required("Role is required"),
});

const initialValues: UserFormValues = {
  email: "",
  password: "",
  confirmPassword: "",
  role: "",
};

export default function UserForm({ onSubmit }: UserFormProps) {
  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        borderRadius: 3,
        mb: 4,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          fontWeight: 600,
          fontSize: { xs: "1.1rem", md: "1.25rem" },
        }}
      >
        Add New User
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={userValidationSchema}
        onSubmit={onSubmit}
      >
        {({
          errors,
          touched,
          isSubmitting,
          values,
          handleChange,
          handleBlur,
        }) => (
          <Form>
            <Stack spacing={3}>
              {/* First Row: Email and Password */}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email Address"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  disabled={isSubmitting}
                  placeholder="user@example.com"
                />

                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  disabled={isSubmitting}
                  placeholder="Enter password"
                />
              </Stack>

              {/* Second Row: Confirm Password and Role */}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  fullWidth
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.confirmPassword && Boolean(errors.confirmPassword)
                  }
                  helperText={touched.confirmPassword && errors.confirmPassword}
                  disabled={isSubmitting}
                  placeholder="Re-enter password"
                />

                <TextField
                  fullWidth
                  select
                  id="role"
                  name="role"
                  label="Role"
                  value={values.role}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.role && Boolean(errors.role)}
                  helperText={touched.role && errors.role}
                  disabled={isSubmitting}
                >
                  <MenuItem value="">
                    <em>Select Role</em>
                  </MenuItem>
                  <MenuItem value="ADMIN">Admin</MenuItem>
                  <MenuItem value="EMPLOYEE">Employee</MenuItem>
                </TextField>
              </Stack>

              {/* Submit Buttons */}
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  type="reset"
                  variant="outlined"
                  disabled={isSubmitting}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    bgcolor: "var(--color-primary)",
                    "&:hover": {
                      bgcolor: "var(--color-primary-dark)",
                    },
                  }}
                >
                  {isSubmitting ? "Creating..." : "Create User"}
                </Button>
              </Stack>
            </Stack>
          </Form>
        )}
      </Formik>
    </Paper>
  );
}

export type { UserFormValues };