import { Navbar } from "@/components/appbar";
import { BaseProps } from "@/models";
import Paper from "@mui/material/Paper";
import {
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  CalendarMonth,
  Delete,
  Payments,
  PersonAddAlt,
  Settings,
} from "@mui/icons-material";
import {
  addSalary,
  addStaff,
  deleteStaff,
  getSalaries,
  getStaff,
} from "./service";
import AddStaff from "@/components/dialogs/addStaff";
import { AddSalary } from "@/components/dialogs/addSalary";
import StaffDetail from "@/components/dialogs/staffDetail";

const Staff = ({ darkMode, toggleDarkMode }: BaseProps) => {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [staff, setStaff] = useState<any[]>([]);
  const [staffDetail, setStaffDetail] = useState();
  const [salaryDialog, setSalaryDialog] = useState(false);
  const [staffDetailDialog, setStaffDetailDialog] = useState(false);

  useEffect(() => {
    getStaff({ setStaff });
  }, []);

  function submit(e: any) {
    e.preventDefault();
    const data = new FormData(e.target);
    const jsonData = Object.fromEntries(data) as any;
    jsonData.salary = Number(jsonData.salary.toString());
    addStaff(jsonData, { setStaff });
    setOpenDialog(false);
  }

  const deleteExp = (id: number) => {
    deleteStaff(id).then((deleted: any) => {
      const index = staff?.findIndex((value) => value.id === deleted.id);
      staff?.splice(index, 1);
      setStaff([...staff]);
    });
  };

  function paySalary(row: any): void {
    setStaffDetail(row);
    setSalaryDialog(true);
  }

  async function handleAddSalary(data) {
    await addSalary(data);
    getStaff({ setStaff });
    setSalaryDialog(false);
  }

  async function openDetailDialog(id: any) {
    await getSalaries(id, setStaffDetail);
    setStaffDetailDialog(true);
  }

  return (
    <Container
      style={{
        maxWidth: "100%",
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(3),
      }}
    >
      <Navbar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        heading={"Staff Management"}
        route="/dashboard"
      >
        <Button
          endIcon={<PersonAddAlt />}
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
          disableElevation
        >
          Add New Member
        </Button>
        <TextField
          variant="outlined"
          label="Search "
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Navbar>
      <br />
      <br />
      <Card
        elevation={0}
        variant="outlined"
        style={{ marginBottom: 10, borderRadius: 20 }}
      >
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "space-between",
            paddingLeft: 15,
            paddingRight: 35,
          }}
        >
          <Typography
            style={{ fontSize: "18px", color: theme.palette.text.primary }}
          >
            <CalendarMonth />
            <br />
            Month {new Date().getMonth() + 1}-{new Date().getUTCFullYear()}
          </Typography>
          <Typography variant="body1" color={theme.palette.text.secondary}>
            <PersonAddAlt /> Total Staff <br />
            <span
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: theme.palette.success.main,
              }}
            >
              {staff.length}
            </span>
          </Typography>
          <Typography variant="body1" color={theme.palette.text.secondary}>
            <Payments /> Total Salaries <br />
            <span
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: theme.palette.success.main,
              }}
            >
              Rs. {staff.reduce((prev, curr) => prev + curr.salary, 0)}
            </span>
          </Typography>
          <Typography variant="body1" color={theme.palette.text.secondary}>
            Salaries Paid <br />
            <span
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: theme.palette.success.main,
              }}
            >
              Rs. 0
            </span>
          </Typography>
          <Typography variant="body1" color={theme.palette.text.secondary}>
            Remaining Salaries <br />
            <span
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: theme.palette.error.main,
              }}
            >
              Rs. 0
            </span>
          </Typography>
        </CardContent>
      </Card>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} padding={"none"}>
          <TableHead>
            <TableRow>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Phone</TableCell>
              <TableCell align="center">Joining Date</TableCell>
              <TableCell align="center">Salary</TableCell>
              <TableCell align="center">Salary Status</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staff?.map((row: any) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell
                  align="center"
                  component="th"
                  scope="row"
                  sx={{ wordBreak: "break-all", maxWidth: 200 }}
                >
                  {row.name}
                </TableCell>
                <TableCell align="center">{row.phoneNumber}</TableCell>
                <TableCell align="center">
                  {new Date(row.createdAt).toDateString()}
                </TableCell>
                <TableCell align="center">Rs. {row.salary}</TableCell>
                <TableCell align="center">
                  <span
                    style={{
                      backgroundColor: row.salaries.length
                        ? theme.palette.success.main
                        : "",
                      fontWeight: "bolder",
                      padding: 10,
                    }}
                  >
                    {row.salaries?.length ? (
                      "Paid " + row.salaries[0].amount
                    ) : (
                      <Button
                        sx={{ textTransform: "none" }}
                        onClick={() => paySalary(row)}
                      >
                        Pay Salary
                      </Button>
                    )}
                  </span>
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Details">
                    <IconButton onClick={() => openDetailDialog(row.id)}>
                      <Settings color="info" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => deleteExp(row.id)}>
                      <Delete color="error" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <AddStaff
        onSubmit={submit}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      />

      <AddSalary
        open={salaryDialog}
        setOpen={setSalaryDialog}
        onConfirm={handleAddSalary}
        staff={staffDetail}
      />

      <StaffDetail
        open={staffDetailDialog}
        setOpen={setStaffDetailDialog}
        staffDetail={staffDetail}
      />
    </Container>
  );
};

export default Staff;
