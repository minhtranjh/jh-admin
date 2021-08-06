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
  removeMemberFromFirebase,
  filterListMember,
  clearFilteredMemberList,
  pagingMemberList,
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
import { useRef } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import NotifyDialog from "../../components/NotifyDialog/NotifyDialog";
import PaginationBar from "../../components/PaginationBar/PaginationBar";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import useConfirm from "../../utils/useConfirm";
const tablePropertyList = [
  {
    label: "No.",
    render: ({ currentPage, rowsPerPage, index }) => {
      return <span>{rowsPerPage * (currentPage - 1) + (index + 1)}.</span>;
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
    render: ({ rowData, rowHandlers, history }) => {
      return (
        <div className="tableAction">
          <button
            onClick={() =>
              rowHandlers.showConfirm(`Do you want to delete ${rowData.firstName}?`)({
                callback: rowHandlers.handleRemoveMember,
                param: rowData.id,
              })
            }
            className="tableWidgetBtn"
          >
            <i className="far fa-trash-alt"></i>
          </button>
          <NavLink
            to={{
              pathname: `${history.location.pathname}`,
              search: `${history.location.search}&form=true&id=${rowData.id}`,
              state: rowData.id,
            }}
          >
            <button className="tableWidgetBtn">
              <i className="far fa-edit"></i>
            </button>
          </NavLink>
          <NavLink to={`/member/${rowData.id}`} className="tableWidgetBtn">
            <i className="far fa-copy"></i>
          </NavLink>
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
  dateOfBirth: {
    value: "",
    placeholder: "Birth",
    name: "dateOfBirth",
    type: "date",
    isTouched: false,

    // labelIcon: <i className="labelIcon" className="far fa-envelope"></i>,
  },
  joinedDate : {
    value : "",
    placeholder: "Joined Date",
    name : "joinedDate",
    type : "date",
    isTouched: false,
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
const MemberPage = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams(); // needed
  const firstRender = useRef(true);
  const query = useQuery();
  const { position, member, team } = useSelector((state) => state);
  const {
    inputList,
    setInputList,
    handleOnInputChange,
    handleSubmitCallback,
    clearInputForm,
    handleSetTouchedInput,
    setValueToInputValue,
  } = useForm(initialInputList, handleSubmitForm);
  const {
    filterList,
    handleCreateFilterObject,
    setFilterList,
    handleOnChangeFilter,
    handleOnAppyFilter,
  } = useFilter(initialFilterList, applyFilter);
  const { validateEmptyField, validateEmailFormat } = useValidator();

  useEffect(() => {
    inputList.firstName.validators = [
      validateEmptyField("Field must be not empty"),
    ];
    inputList.lastName.validators = [
      validateEmptyField("Field must be not empty"),
    ];
    inputList.email.validators = [
      validateEmptyField("Field must be not empty"),
      validateEmailFormat("Email is not valid"),
    ];
    inputList.position.validators = [
      validateEmptyField("Field must be not empty"),
    ];
    inputList.team.validators = [validateEmptyField("Field must be not empty")];
    inputList.gender.validators = [
      validateEmptyField("Field must be not empty"),
    ];
    inputList.about.validators = [
      validateEmptyField("Field must be not empty"),
    ];
    inputList.phone.validators = [
      validateEmptyField("Field must be not empty"),
    ];
    inputList.dateOfBirth.validators = [
      validateEmptyField("Field must be not empty"),
    ];
    inputList.picture.validators = [
      validateEmptyField("Field must be not empty"),
    ];
  }, []);

  useEffect(() => {
    const id = query.get("id");
    if (id && query.get("form") === "true") {
      dispatch(getMemberDetailsByIdFromFirebase(id));
      return;
    }
  }, [history.location.search]);
  useEffect(() => {
    if (
      !member.isMemberDetailsLoading &&
      JSON.stringify(member.memberDetails) !== "{}"
    ) {
      setValueToInputValue(member.memberDetails);
    }
  }, [member.isMemberDetailsLoading]);
  useEffect(() => {
    if (!position.isLoading && !team.isLoading) {
      const newInputList = { ...inputList };
      const newFilterList = { ...filterList };
      newInputList.position.options = position.positionList;
      newFilterList.position.options = position.positionList;
      newFilterList.team.options = team.teamList;
      newInputList.team.options = team.teamList;
      setInputList(newInputList);
      setFilterList(newFilterList);
    }
  }, [position.isLoading, team.isLoading]);
  useEffect(() => {
    const getNeededStateFromRedux = () => {
      dispatch(getListMembersFromFirebase(1, 10));
      dispatch(getPositionListFromFirebase());
      dispatch(getTeamListFromFirebase());
    };
    getNeededStateFromRedux();
  }, [dispatch]);
  useEffect(() => {
    if (
      history.location.search &&
      query.get("search") === "true" &&
      !member.isLoading
    ) {
      const filterObj = handleCreateFilterObject();
      if (member.pagedMemberList.length > 0) {
        return dispatch(filterListMember(filterObj));
      }
    }
  }, [history.location.search, member.isLoading]);
  useEffect(() => {
    updateSearchParams();
  }, [member.isEditting, member.isCreating]);

  function updateSearchParams() {
    if (firstRender.current) {
      history.push({
        pathname: history.location.pathname,
        search: history.location.search,
      });
      firstRender.current = false;
      return;
    }
    if (!member.isEditting && !member.isCreating) {
      const query = new URLSearchParams(history.location.search);
      query.delete("id");
      query.delete("form");
      history.push({
        pathname: history.location.pathname,
        search: query.toString(),
      });
    }
  }
  function handleSubmitForm(member) {
    if (!query.get("id")) {
      return dispatch(createNewMemberToFirebase(member));
    }
    return dispatch(
      editMemberDetailsToFirebase({
        ...member,
        id: query.get("id"),
      })
    );
  }
  const clearFilterUrlParam = () => {
    history.push({
      pathname: history.location.pathname,
      search: "",
    });
  };
  const pushFilterListToSearchParam = (filterListSearchParams) => {
    history.push({
      pathname: history.location.pathname,
      search: `?${filterListSearchParams}`,
    });
  };
  function applyFilter(filterListSearchParams) {
    const filterListSearchParamsTemp = "search=true&";
    if (filterListSearchParams === filterListSearchParamsTemp) {
      clearFilterUrlParam();
      dispatch(clearFilteredMemberList());
      return;
    }
    pushFilterListToSearchParam(filterListSearchParams);
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
  function handlePagingListMember(currentPage, rowsPerPage) {
    dispatch(pagingMemberList(currentPage, rowsPerPage));
  }
  const { confirmState,message, onConfirm, onCancel, showConfirm } = useConfirm();
  return (
    <>
      {!checkIsLoadingToViewLoadingIcon() ? <FormLoading /> : ""}
      <NotifyDialog message={member.message} error={member.error} />
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
                search: `${history.location.search}&form=true`,
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
            rowHandlers={{ handleRemoveMember, showConfirm }}
            tablePropertyList={tablePropertyList}
            currentPage={member.currentPage}
            rowsPerPage={member.rowsPerPage}
            tableDataList={
              !member.isFiltering && member.filteredMemberList.length <= 0
                ? member.pagedMemberList
                : member.filteredMemberList
            }
          />
          <PaginationBar
            isFiltering={member.isFiltering}
            isLoading={member.isLoading}
            currentPage={member.currentPage}
            rowsPerPage={member.rowsPerPage}
            totalPages={member.totalPages}
            handlePagingTable={handlePagingListMember}
          />
        </PageContent>
      </div>
      <ConfirmModal
        confirmState={confirmState}
        onCancel={onCancel}
        message={message}
        onConfirm={onConfirm}
      />
      <FormModal
        isContentLoading={member.isMemberDetailsLoading}
        title={query.get("id") ? `Edit member` : "Create a new member"}
        clearForm={clearInputForm}
        handleSetTouchedInput={handleSetTouchedInput}
        handleSubmitForm={handleSubmitCallback}
        handleOnInputChange={handleOnInputChange}
        inputList={inputList}
        history={history}
        isModalOpen={!!query.get("form")}
        error={member.error}
      />
    </>
  );
};

export default MemberPage;
