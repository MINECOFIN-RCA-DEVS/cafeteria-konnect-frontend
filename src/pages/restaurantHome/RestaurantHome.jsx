import React, { useState } from 'react';
import { FaArrowRightLong } from 'react-icons/fa6';
import TableComponent from '../../components/table/TableComponent';
import { AddAttendeeManually } from '../../components/buttons/Buttons';
import * as Yup from 'yup';
import { toast, Bounce } from 'react-toastify';
import Toast from './../../components/toast/Toast';
import { MdDangerous } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';


const StatsCard = ({ title, text, style }) => (
  <div className="p-4 w-full md:w-1/2 ">
    <p className="text-slate-500 text-sm mb-2">{title}</p>
    <div
      className={`${style} rounded bg-opacity-25 py-6 px-10 text-center text-[#4069B0] text-xl font-bold shadow-statsCard`}
    >
      {text}
    </div>
  </div>
);

const EstimatedAttendeesCard = ({ text, style, time }) => (
  <div className="p-4 w-[70%] ">
    <div
      className={`${style} rounded bg-opacity-25 py-6 px-10 text-center text-[#4069B0] text-xl font-bold shadow-statsCard relative`}
    >
      <p className="mb-2">{text}</p>
      <p className="absolute text-xs font-light mt-4 bottom-2 right-2">
        {time}
      </p>
    </div>
  </div>
);

const allAttendence = [
  {
    id: 20240602,
    name: 'Nshuti Ruranga Jabes',
    department: 'Consultant',
    date: '2024-06-04',
    email: 'nshuti@gmail.com',
  },
  {
    id: 20240602,
    name: 'Ineza Kajuga',
    department: 'intern',
    date: '2024-06-04',
    email: 'jabes@gmail.com',
  },
  {
    id: 20240602,
    name: 'Marie Honnette',
    department: 'intern',
    date: '2024-06-04',
    email: 'honnette@gmail.com',
  },
];

const attendenceHeaders = ['Id', 'Name', 'Department'];
const attendenceData = allAttendence.map((attendence) => [
  attendence.id,
  attendence.name,
  attendence.department,
]);

//This is the array through which we will filter when the restaurant manager wants to add an attendee manually
const attendenceToFilter = allAttendence.map((attendence) => [
  attendence.email,
  <AddAttendeeManually />,
]);

const validationSchema = Yup.object().shape({
  names: Yup.string()
    .min(2, 'First name and last name must be both more than two characters')
    .required('Names are required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
});

function RestaurantHome(props) {
  const [addNewAttendee, setaddNewAttendee] = useState(false);
  const [addToAddendence, setAddToAddendence] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [scannedInput, setScannedInput] = useState('');
  const [scannedList, setScannedList] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const {decryptData,secretKey} = useAuth();

  // Function to get today's date in YYYY-MM-DD format
  const getFormattedDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Initialize state with the current date formatted as YYYY-MM-DD
  const [selectedDate, setSelectedDate] = useState(
    getFormattedDate(new Date())
  );

  const handleSelectedDate = (event) => {
    setSelectedDate(event.target.value);
    console.log('selected date: ', selectedDate);
  };

  const filterEmails = (input) => {
    const filtered = allAttendence.filter((attendence) =>
      attendence.email.toLowerCase().includes(input.toLowerCase())
    );
    setFilteredEmails(filtered);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchInput(value);
    filterEmails(value);
  };

  const handleScan = (event) => {
    const value = event.target.value; // Handle both input change and button click
    setScannedInput(value);
    setErrorMessage(''); // Clear any previous error message

    const isValidScanObject = (obj) => {
      return (
        obj &&
        typeof obj === 'object' &&
        (typeof obj.id === 'string' || typeof obj.id === 'number') &&
        String(obj.id).trim() !== '' &&
        typeof obj.email === 'string' &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(obj.email) &&
        typeof obj.uniqueIdentifier === 'string' &&
        obj.uniqueIdentifier.trim() !== '' &&
        Object.keys(obj).length === 3
      );
    };

    const decryptedData = decryptData(value, secretKey);
    console.log('decryptedData: ',decryptedData);

    if (typeof decryptedData === 'string' && decryptedData.trim().endsWith('}')) {
      try {
        const scannedObject = JSON.parse(decryptedData);

        if (isValidScanObject(scannedObject)) {
          setScannedList((prevList) => [
            ...prevList,
            {
              id: String(scannedObject.id), // Convert id to string for consistency
              email: scannedObject.email,
              uniqueIdentifier: scannedObject.uniqueIdentifier,
            },
          ]);
          toast.success('Successfully scanned and validated', {
            position: 'top-right',
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
            transition: Bounce,
          });
        } else {
          throw new Error('Invalid object structure');
        }
      } catch (error) {
        console.error('Scan validation error:', error);
        setErrorMessage('Invalid Qr Code. Please try again.');
        toast.error('Invalid Qr Code', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
          transition: Bounce,
        });
      } finally {
        // Clear the input field in both success and error cases
        setScannedInput('');
      }
    }

    console.log('Current input:', value);
    console.log('Scanned list:', scannedList);
  };
  return (
    <div>
      <h1 className="font-semibold text-mainGray">This Week</h1>

      <div className={`w-full px-4 py-2`}>
        <div className="w-full flex flex-col md:flex-row justify-between items-end ">
          <StatsCard title="Today" text="0" style="bg-[#008000] bg-opacity-2" />
          <StatsCard
            title="This week"
            text="1143"
            style="bg-[#4069B0] bg-opacity-2"
          />
          <StatsCard
            title="This month"
            text="5203"
            style="bg-[#808080] bg-opacity-2"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">

        {addNewAttendee && (
          <div className="fixed top-0 left-0 bg-bgBlue z-[40] h-screen w-screen overflow-y-auto overflow-x-auto flex items-center justify-center">
            <div className="relative bg-white w-[90%] lg:w-[38%] lg:h-[26rem] h-max px-[3.5%] lg:py-[1.7%] md:py-[3%] py-[10%] rounded-md ">
              <div className="w-[90%] mx-auto flex flex-col gap-8 h-full">
                <button
                  className="close border-2 border-mainRed rounded-md px-2 text-mainRed absolute right-4 top-4"
                  onClick={() => setaddNewAttendee(false)}
                >
                  x
                </button>
                <h1 className="w-[60%] capitalize text-[#078ECE] font-semibold text-xl">
                  Add New attendee
                </h1>

                <div>
                  <form>
                    <input
                      aria-label="Search Email"
                      type="text"
                      placeholder="Enter attendee email"
                      value={searchInput}
                      onChange={handleSearchChange}
                      className="border-[1px] px-4 py-2 text-sm outline-none w-full mb-4 rounded-full"
                    />
                  </form>
                  <h2 className="text-gray-500">Matching results</h2>
                  <ul className="w-full mt-2 h-[30vh] border-2 border-gray-200 overflow-y-auto px-2 py-4 rounded-md">
                    {filteredEmails.length > 0 ? (
                      filteredEmails.map((attendence) => (
                        <div
                          className="w-full flex items-center justify-between border-[1px] border-gray-200 my-2 p-2"
                          key={attendence.id}
                        >
                          <li className="text-sm">{attendence.email}</li>
                          <AddAttendeeManually email={attendence.email} />
                        </div>
                      ))
                    ) : (
                      <span>No match found</span>
                    )}
                  </ul>
                </div>

               
              </div>
            </div>
          </div>
        )}

        {addToAddendence && (
          <div className="fixed top-0 left-0 bg-bgBlue z-[40] h-screen w-screen overflow-y-auto overflow-x-auto flex items-center justify-center">
            <Toast />
            <div className="relative bg-white w-[90%] lg:w-[38%] lg:h-max h-max px-[3.5%] lg:py-[1.7%] md:py-[3%] py-[10%] rounded-md ">
              <div className="w-[90%] mx-auto flex flex-col gap-8 h-full">
                <button
                  className="close border-2 border-mainRed rounded-md px-2 text-mainRed absolute right-4 top-4"
                  onClick={() => setAddToAddendence(false)}
                >
                  x
                </button>
                <h1 className="w-[60%] capitalize text-[#078ECE] font-semibold text-xl">
                  Scan QRCodes
                </h1>

                <div>
                  <form>
                    <input
                      aria-label="Search Email"
                      type="text"
                      placeholder="Scan Qr codes"
                      value={scannedInput}
                      onChange={handleScan}
                      className="border-[1px] px-4 py-2 text-sm outline-none w-full mb-4 rounded-full focus:ring-2 focus:ring-inset focus:ring-green-500"
                    />
                  </form>
                  {errorMessage && (
                    <div className="error text-red-500 mt-2 relative border-[1px] min-h-[10vh] h-max p-2 flex flex-col md:flex-row gap-2 items-start md:items-center">
                      <button
                        className="close border-[1px] border-mainRed rounded-md px-2 text-mainRed absolute right-2 top-2 text-sm"
                        onClick={() => setErrorMessage()}
                      >
                        x
                      </button>
                      <MdDangerous className="text-6xl" />
                      <p className="w-[80%] text-sm">{errorMessage}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-3 md:items-center mb-3 mt-5">
          <div className="w-1/3 text-lg text-gray-500 font-semibold">
            <form action="">
              <div>
                <label className="text-sm mr-4">Choose date: </label>
                <input
                  aria-label="Date"
                  type="date"
                  defaultValue={selectedDate}
                  className="border-[1px] px-4 py-2 cursor-pointer text-sm outline-none"
                  onChange={handleSelectedDate}
                />
              </div>
            </form>
          </div>
          <div
            className="w-max mt-4 md:mt-[0px] "
            onClick={() => setAddToAddendence(true)}
          >
            <div>
              {/* <MainButton text={'+ Add To Attendence'} /> */}
              <button className="btn btn-primary text-white float-right bg-mainBlue border-2 rounded-md mb-2 py-2 px-4 hover:bg-white hover:text-mainBlue hover:border-2 hover:border-mainBlue">
                Scan Qr Code
              </button>
            </div>
          </div>
          <div
            className="w-max mt-4 md:mt-[0px]"
            onClick={() => setaddNewAttendee(true)}
          >
            <div>
              {/* <MainButton text={'+ Add Attendee Manually'} /> */}
              <button className="btn btn-primary text-white float-right bg-red-500 border-2 rounded-md mb-2 py-2 px-4 hover:bg-white hover:text-red-500 hover:border-2 hover:border-red-500">
                + Add Attendee Manually
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col-reverse md:flex-row gap-4">
        <div className="w-full md:w-3/4 border-[1px] border-gray-200 rounded-md py-3 px-4 mt-4">
          <p className="text-xs font-semibold">
            Date: <span className="text-mainBlue">{selectedDate}</span>
          </p>
          <TableComponent headers={attendenceHeaders} data={attendenceData} />
        </div>
        <div className="w-full md:w-1/4 p-4 border-[1px] border-gray-200 rounded-md mt-4 bg-[#4069B0] bg-opacity-[7%] flex flex-col items-center gap-2">
          <h1 className="text">Recent Activity</h1>
          <p className="text-gray-400 font-medium text-sm">
            Estimated attendees
          </p>
          <EstimatedAttendeesCard
            text="345"
            time="3hr ago"
            style="bg-[#008000] bg-opacity-2 "
          />
        </div>
      </div>
    </div>
  );
}

export default RestaurantHome;
