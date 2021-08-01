import React from "react";
import PageTitle from "../../components/PageTitle/PageTitle";
import bg from "../../assets/images/member-page-bg.jpeg";
import "./MemberPage.css";
import PageContent from "../../components/PageContent/PageContent";
import Table from "../../components/Table/Table";
import Button from "../../components/Button/Button";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  createNewMemberToFirebase,
  editMemberDetailsToFirebase,
  getListMembersFromFirebase,
  getMemberDetailsByIdFromFirebase,
  setMemberDetailFromTempList,
  removeMemberFromFirebase,
  filterListMember,
  clearFilteredMemberList,
} from "../../redux/actions/member";
import { Link, NavLink, useHistory, useParams } from "react-router-dom";
import FormModal from "../../components/FormModal/FormModal";
import useForm from "../../utils/useForm";
import useQuery from "../../utils/useQuery";

import { getPositionListFromFirebase } from "../../redux/actions/position";
import { getTeamListFromFirebase } from "../../redux/actions/team";
import FormLoading from "../../components/FormLoading/FormLoading";
import FilterBar from "../../components/FilterBar/FilterBar";
import useFilter from "../../utils/useFilter";
import useValidator from "../../utils/useValidator";
const tablePropertyList = [
  {
    label: "No.",
    render: ({ rowData, index }) => {
      return <span>{index + 1}.</span>;
    },
  },
  {
    label: "Basic Info",
    render: ({ rowData }) => {
      return (
        <div className="bold infoBox">
          <img
            className="memberAvatar"
            src={rowData.picture}
            alt={`${rowData.firstName} avatar`}
          />
          <div className="memberName">
            <p>{rowData.firstName + " " + rowData.lastName}</p>
            <p>{rowData.email}</p>
          </div>
        </div>
      );
    },
  },
  {
    label: "Position",
    render: ({ rowData }) => {
      return <span>{rowData.position}</span>;
    },
  },
  {
    label: "Gender",
    render: ({ rowData }) => {
      return <span>{rowData.gender}</span>;
    },
  },
  {
    label: "Joined Date",
    render: ({ rowData }) => {
      return <span>{rowData.joinedDate}</span>;
    },
  },
  {
    label: "Team",
    render: ({ rowData }) => {
      return rowData.team ? <span>{rowData.team}</span> : "Null";
    },
  },
  {
    label: "Action",
    render: ({ rowData, handleRemoveItem, history }) => {
      return (
        <div class="tableAction">
          <button
            onClick={() => handleRemoveItem(rowData.id)}
            className="tableWidgetBtn"
          >
            <i className="far fa-trash-alt"></i>
          </button>
          <NavLink
            to={{
              pathname: `${history.location.pathname}`,
              search: "?form=true",
              state: rowData.id,
            }}
          >
            <button className="tableWidgetBtn">
              <i className="far fa-edit"></i>
            </button>
          </NavLink>
          <button className="tableWidgetBtn">
            <i className="far fa-copy"></i>
          </button>
        </div>
      );
    },
  },
];
const initialInputList = {
  firstName: {
    value: "",
    placeholder: "First Name",
    name: "firstName",
    type: "text",
    isTouched: false,
    // labelIcon: <i className="labelIcon fas fa-file-signature"></i>,
  },
  lastName: {
    value: "",
    placeholder: "Last Name",
    name: "lastName",
    type: "text",
    isTouched: false,

    // labelIcon: <i className="far fa-user"></i>,
  },
  email: {
    value: "",
    placeholder: "Email",
    name: "email",
    type: "email",
    isTouched: false,

    // labelIcon: <i className="labelIcon" className="far fa-envelope"></i>,
  },
  picture: {
    value: "",
    placeholder: "Picture",
    name: "picture",
    type: "file",
    isTouched: false,

    // labelIcon: <i className="labelIcon" className="far fa-envelope"></i>,
  },
  gender: {
    value: "",
    placeholder: "Male/Female",
    name: "gender",
    type: "radio",
    options: [{ name: "male" }, { name: "female" }],
    optionLabel: "name",
    isTouched: false,

    // labelIcon: <i className="labelIcon" className="far fa-envelope"></i>,
  },
  dateOfBirth: {
    value: "",
    placeholder: "Birth",
    name: "dateOfBirth",
    type: "date",
    isTouched: false,

    // labelIcon: <i className="labelIcon" className="far fa-envelope"></i>,
  },
  phone: {
    value: "",
    placeholder: "Phone Number",
    name: "phone",
    isTouched: false,

    type: "text",
    // labelIcon: <i className="labelIcon" className="far fa-envelope"></i>,
  },
  about: {
    value: "",
    placeholder: "Description",
    name: "about",
    type: "textarea",
    isTouched: false,

    // labelIcon: <i className="labelIcon" className="far fa-envelope"></i>,
  },
  team: {
    value: "",
    placeholder: "Team",
    name: "team",
    isTouched: false,
    optionLabel: "name",
    type: "select",
    // labelIcon: <i className="labelIcon" className="far fa-envelope"></i>,
  },
  position: {
    value: "",
    isTouched: false,
    placeholder: "Position",
    name: "position",
    optionLabel: "name",
    type: "select",
    // labelIcon: <i className="labelIcon" className="far fa-envelope"></i>,
  },
};
const initialFilterList = {
  name: {
    label: "Name",
    type: "text",
    name: "name",
    value: "",
    isOpen: false,
  },
  email: {
    label: "Email",
    type: "text",
    name: "email",
    value: "",
    isOpen: false,
  },
  position: {
    label: "Position",
    type: "radio",
    options: [],
    optionLabel: "name",
    name: "position",
    isOpen: false,
    value: "",
  },
  team: {
    label: "Team",
    type: "radio",
    options: [],
    isOpen: false,
    optionLabel: "name",
    name: "team",
    value: "",
  },
};
const MemberPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams(); // needed
  const query = useQuery();
  const { position, member, team } = useSelector((state) => state);
  const {
    inputList,
    setInputList,
    handleOnInputChange,
    handleSubmitCallback,
    clearInputForm,
    handleSetTouchedInput,
  } = useForm(initialInputList, handleSubmitForm);
  const {
    filterList,
    setFilterList,
    handleOnChangeFilter,
    handleOnAppyFilter,
  } = useFilter(initialFilterList, applyFilter);

  const { validateEmptyField, validateEmailFormat, combineValidation } =
    useValidator();

  useEffect(() => {
    const addValidatorToInputList = () => {
      inputList.firstName.validators = [validateEmptyField];
      inputList.lastName.validators = [validateEmptyField];
      inputList.email.validators = [validateEmptyField, validateEmailFormat];
      inputList.position.validators = [validateEmptyField];
      inputList.team.validators = [validateEmptyField];
      inputList.gender.validators = [validateEmptyField];
      inputList.about.validators = [validateEmptyField];
      inputList.phone.validators = [validateEmptyField];
      inputList.dateOfBirth.validators = [validateEmptyField];
      inputList.picture.validators = [validateEmptyField];
    };
    addValidatorToInputList();
  }, []);

  useEffect(() => {
    const getMemberDetailsFromReduxStore = () => {
      const id = history.location.state;
      if (id && query.get("form")) {
        const result = member.memberDetailsTempList.find(
          (item) => item.id === id
        );
        if (result) {
          dispatch(setMemberDetailFromTempList(result));
          return;
        }
        dispatch(getMemberDetailsByIdFromFirebase(id));
      }
    };
    getMemberDetailsFromReduxStore();
  }, [history.location.state]);

  useEffect(() => {
    if (!member.isMemberDetailsLoading) {
      const addMemberDetailsValueToInputValues = () => {
        const newList = { ...inputList };
        for (const input in newList) {
          newList[input].value = member.memberDetails[input];
        }
        setInputList(newList);
      };
      addMemberDetailsValueToInputValues();
    }
  }, [member.isMemberDetailsLoading]);

  useEffect(() => {
    if (!position.isLoading && !team.isLoading) {
      const addPositionAndTeamListToSelectionInputValue = () => {
        const newInputList = { ...inputList };
        const newFilterList = { ...filterList };
        newInputList.position.options = position.positionList;
        newFilterList.position.options = position.positionList;
        newFilterList.team.options = team.teamList;
        newInputList.team.options = team.teamList;
        setInputList(newInputList);
        setFilterList(newFilterList);
      };
      addPositionAndTeamListToSelectionInputValue();
    }
  }, [position.isLoading, team.isLoading]);

  useEffect(() => {
    const getNeededStateFromRedux = () => {
      dispatch(getListMembersFromFirebase());
      dispatch(getPositionListFromFirebase());
      dispatch(getTeamListFromFirebase());
    };
    getNeededStateFromRedux();
  }, [dispatch]);
  useEffect(() => {
    if (!member.isDeleting && !member.isEditting && !member.isCreating) {
      history.push({
        pathname: history.location.pathname,
        state: undefined,
      });
    }
  }, [member.isDeleting, member.isEditting, member.isCreating]);

  useEffect(() => {
    const handleFilterMemberList = () => {
      if (history.location.search && query.get("search") && !member.isLoading) {
        const newFilterList = { ...filterList };
        const filterObj = {};
        for (const filter in newFilterList) {
          if (query.get(filter)) {
            newFilterList[filter].value = query.get(filter);
            newFilterList[filter].isOpen = true;
            filterObj[filter] = { ...newFilterList[filter] };
          } else {
            newFilterList[filter].value = "";
            newFilterList[filter].isOpen = false;
          }
        }
        setFilterList(newFilterList);
        if (member.memberList.length > 0) {
          return dispatch(filterListMember(filterObj));
        }
      }
    };
    handleFilterMemberList();
  }, [history.location.search, member.isLoading]);

  function handleSubmitForm() {
    if (!history.location.state) {
      return dispatch(createNewMemberToFirebase(inputList));
    }
    return dispatch(
      editMemberDetailsToFirebase({
        ...inputList,
        id: history.location.state,
      })
    );
  }

  function applyFilter() {
    let searchParams = "search=true&";
    const searchParamsTemp = "search=true&";
    for (const filter in filterList) {
      if (filterList[filter].isOpen) {
        searchParams += `${filter}=${filterList[filter].value}&`;
      }
    }
    if (searchParams === searchParamsTemp) {
      history.push({
        pathname: history.location.pathname,
        state: history.location.state,
      });
      return dispatch(clearFilteredMemberList());
    }
    history.push({
      pathname: history.location.pathname,
      search: `?${searchParams}`,
      state: history.location.state,
    });
  }
  function handleRemoveMember(id) {
    dispatch(removeMemberFromFirebase(id));
  }
  function checkIsLoadingToViewLoadingIcon() {
    return (
      !position.isLoading &&
      !team.isLoading &&
      !member.isLoading &&
      !member.isDeleting &&
      !member.isEditting &&
      !member.isCreating
    );
  }
  return (
    <>
      {!checkIsLoadingToViewLoadingIcon() ? <FormLoading /> : ""}
      <div className="memberPage">
        <PageTitle
          description="Manage member"
          background={bg}
          title="Member"
          icon={<i className="far fa-user"></i>}
        />
        <PageContent>
          <div className="searchBarWrapper">
            <Link
              to={{
                pathname: `${history.location.pathname}`,
                search: "?form=true",
                state: undefined,
              }}
              className="newBtn"
            >
              <Button onClick={clearInputForm}>
                NEW <i className="fas fa-plus"></i>
              </Button>
            </Link>
          </div>
          <FilterBar
            filterList={filterList}
            setFilterList={setFilterList}
            handleOnChangeFilter={handleOnChangeFilter}
            handleOnApplyFilter={handleOnAppyFilter}
          />
          <Table
            handleRemoveItem={handleRemoveMember}
            tablePropertyList={tablePropertyList}
            tableDataList={
              !member.isFiltering && member.filteredMemberList.length <= 0
                ? member.memberList
                : member.filteredMemberList
            }
          />
        </PageContent>
      </div>
      <FormModal
        isContentLoading={member.isMemberDetailsLoading}
        title={
          history.location.state
            ? `Edit ${member.memberDetails.firstName} profile`
            : "Create a new member"
        }
        clearForm={clearInputForm}
        handleSetTouchedInput={handleSetTouchedInput}
        handleSubmitForm={handleSubmitCallback}
        combineValidation={combineValidation}
        handleOnInputChange={handleOnInputChange}
        inputList={inputList}
        history={history}
      />
    </>
  );
};

export default MemberPage;
