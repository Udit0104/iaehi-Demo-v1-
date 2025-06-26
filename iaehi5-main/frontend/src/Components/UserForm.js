import { Grid, makeStyles, Paper } from "@material-ui/core";
import { useForm, Form } from "./useForm";
import { Controls } from "./Controls/Controls";
import * as employeeServices from "../Constents/tempServices";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3),
  },
}));

const genderItems = [
  { id: "male", title: "Male" },
  { id: "female", title: "Female" },
  { id: "othe", title: "Other" },
];
const initialValues = {
  id: 0,
  fullName: "",
  email: "",
  mobile: "",
  city: "",
  gender: "male",
  departmentId: "",
  hireDate: new Date(),
  isPermanent: false,
};

function UserForm() {
  const classes = useStyles();
  const { values, setValues, handleChangeInput } = useForm(initialValues);

  return (
    <Paper
      style={{ boxShadow: "0 5px 8px 0 rgba(0, 0, 0, 0.3)" }}
      className={classes.pageContent}
    >
      <Form>
        <Grid container>
          {/* <Grid item xs={6}> */}
          <Controls.Input
            label="Full Name"
            value={values.fullName}
            name="fullName"
            onChange={handleChangeInput}
          />
          <Controls.Input
            label="Email"
            value={values.email}
            name="email"
            onChange={handleChangeInput}
          />
          {/* <Controls.Input
              label="Mobile"
              value={values.mobile}
              name="mobile"
              onChange={handleChangeInput}
            />
             <Controls.Input
              label="City"
              value={values.city}
              name="city"
              onChange={handleChangeInput}
            /> */}
          <Controls.RadioGroup
            label="Gender"
            name="gender"
            value={values.gender}
            onChange={handleChangeInput}
            items={genderItems}
          />
          <Controls.Select
            label="Department"
            name="departmentId"
            value={values.departmentId}
            onChange={handleChangeInput}
            options={employeeServices.getDepartmentCollection()}
          />
          <Controls.DatePicker
            label="Hire Date"
            name="hireDate"
            value={values.hireDate}
            onChange={handleChangeInput}
          />
          <div>
          <Controls.Buttons type="submit" text="Submit" />
          <Controls.Buttons type="submit" color="default" text="Reset" />
          </div>
          {/* <Controls.Checkbox
              label="Permanent Employee"
              name="isPermanent"
              value={values.isPermanent}
              onChange={handleChangeInput}/> */}
          {/* <Controls.Checkbox
              label="Permanent Employee"
              name="isPermanent"
              value={values.isPermanent}
              onChange={handleChangeInput}/> */}

          {/* </Grid> */}
          {/* <Grid item xs={6}>
           
            
            
          </Grid> */}
        </Grid>
      </Form>
    </Paper>
  );
}

export default UserForm;
