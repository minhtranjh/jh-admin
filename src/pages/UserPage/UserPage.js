import React from "react";
import PageTitle from "../../components/PageTitle/PageTitle";
import bg from "../../assets/images/team-bg.jpeg";
import PageContent from "../../components/PageContent/PageContent";
import { Link, useHistory } from "react-router-dom";
import Button from "../../components/Button/Button";
import useForm from "../../utils/useForm";
import useFilter from "../../utils/useFilter";
import FormModal from "../../components/FormModal/FormModal";
import useValidator from "../../utils/useValidator";
import { useDispatch } from "react-redux";
import {
  activeUserToFirebase,
  clearFilteredUserList,
  createNewUserToFirebase,
  editUserDetailsToFirebase,
  filterUserList,
  getUserDetailsFromFirebase,
  getUserListFromFirebase,
  removeUserFromFirebase,
  unActiveUserToFirebase,
} from "../../redux/actions/user";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import FilterBar from "../../components/FilterBar/FilterBar";
import Table from "../../components/Table/Table";
import FormLoading from "../../components/FormLoading/FormLoading";
import useQuery from "../../utils/useQuery";
import { useRef } from "react";
import { removeMemberFromFirebase } from "../../redux/actions/member";
import NotifyDialog from "../../components/NotifyDialog/NotifyDialog";
import PaginationBar from "../../components/PaginationBar/PaginationBar";
const tablePropertyList = [
  {
    label: "No.",
    render: ({ rowData, index }) => {
      return <span>{index + 1}.</span>;
    },
  },
  {
    label: "Email",
    render: ({ rowData }) => {
      return <span>{rowData.email}</span>;
    },
  },

  {
    label: "Name",
    render: ({ rowData }) => {
      return <span>{rowData.name}</span>;
    },
  },
  {
    label: "Password",
    render: ({ rowData }) => {
      return (
        <span>
          <input
            className="passwordColumn"
            type="password"
            value={rowData.password}
            readOnly
          />
        </span>
      );
    },
  },
  {
    label: "Created At",
    render: ({ rowData }) => {
      return <span>{rowData.createdAt}</span>;
    },
  },
  {
    label: "Is Active",
    render: ({ rowData }) => {
      return (
        <span className="activeColumn">
          <input type="checkbox" readOnly checked={rowData.isActive} />
        </span>
      );
    },
  },
  {
    label: "Action",
    render: ({ rowData, rowHandlers, history }) => {
      return (
        <div className="tableAction">
          <button
            onClick={() => rowHandlers.handleRemoveUser(rowData.id)}
            className="tableWidgetBtn"
          >
            <i className="far fa-trash-alt"></i>
          </button>
          <Link
            to={{
              pathname: `${history.location?.pathname}`,
              search: `?form=true&id=${rowData.id}`,
            }}
          >
            <button className="tableWidgetBtn">
              <i className="far fa-edit"></i>
            </button>
          </Link>
          <button className="tableWidgetBtn">
            <i className="far fa-copy"></i>
          </button>
          {rowData.isActive ? (
            <button
              onClick={() => rowHandlers.handleUnactiveUser(rowData.id)}
              className="tableWidgetBtn"
            >
              <i className="fas fa-lock"></i>
            </button>
          ) : (
            <button
              onClick={() => rowHandlers.handleActiveUser(rowData.id)}
              className="tableWidgetBtn"
            >
              <i className="fas fa-unlock"></i>
            </button>
          )}
        </div>
      );
    },
  },
];
const initialInputList = {
  firstName: {
    value: "",
    placeholder: "First name",
    name: "firstName",
    type: "text",
    isTouched: false,
    // labelIcon: <i className="far fa-user"></i>,
  },
  lastName: {
    value: "",
    placeholder: "Last name",
    name: "lastName",
    type: "text",
    isTouched: false,
    // labelIcon: <i className="far fa-user"></i>,
  },
  email: {
    value: "",
    placeholder: "Email",
    isTouched: false,
    name: "email",
    type: "text",
    // labelIcon: <i className="far fa-user"></i>,
  },
  password: {
    value: "",
    placeholder: "Password",
    isTouched: false,
    name: "password",
    type: "password",
    // labelIcon: <i className="far fa-user"></i>,
  },
  confirmPassword: {
    value: "",
    placeholder: "Confirm Password",
    isTouched: false,
    name: "confirmPassword",
    type: "password",
    // labelIcon: <i className="far fa-user"></i>,
  },
  isActive: {
    value: false,
    placeholder: "Active User",
    name: "isActive",
    isTouched: false,
    type: "checkbox",
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
  isActive: {
    value: false,
    label: "Active User",
    name: "isActive",
    isOpen: false,
    type: "checkbox",
  },
};
const UserPage = () => {
  const history = useHistory();
  const firstRender = useRef(true);
  const dispatch = useDispatch();
  const query = useQuery();
  const {
    userList,
    isLoading,
    isFiltering,
    isCreating,
    isEditting,
    isUserDetailsLoading,
    userDetails,
    isDeleting,
    filteredUserList,
    error,
    message,
  } = useSelector((state) => state.user);
  const {
    inputList,
    handleOnInputChange,
    handleSubmitCallback,
    handleSetTouchedInput,
    clearInputForm,
    setValueToInputValue,
  } = useForm(initialInputList, handleSubmitForm);
  const {
    filterList,
    setFilterList,
    handleCreateFilterObject,
    handleOnChangeFilter,
    handleOnAppyFilter,
  } = useFilter(initialFilterList, applyFilter);
  const {
    validateEmptyField,
    validateEmailFormat,
    validateMatchedConfirmPassword,
  } = useValidator();
  useEffect(() => {
    dispatch(getUserListFromFirebase());
  }, []);
  useEffect(() => {
    const id = query.get("id");
    if (id && query.get("form")) {
      dispatch(getUserDetailsFromFirebase(id));
    }
  }, [history.location.search]);
  useEffect(() => {
    if (!isUserDetailsLoading && JSON.stringify(userDetails) != "{}") {
      setValueToInputValue(userDetails);
    }
  }, [isUserDetailsLoading]);
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
    inputList.password.validators = [
      validateEmptyField("Field must be not empty"),
    ];
    inputList.isActive.validators = [
      validateEmptyField("Field must be not empty"),
    ];
  }, []);
  useEffect(() => {
    inputList.confirmPassword.validators = [
      validateEmptyField("Field must be not empty"),
      validateMatchedConfirmPassword("Confirmed password is not matched")(
        inputList.password.value
      ),
    ];
  }, [inputList.password.value]);
  function handleActiveUser(id) {
    dispatch(activeUserToFirebase(id));
  }
  function handleUnactiveUser(id) {
    dispatch(unActiveUserToFirebase(id));
  }
  function handleSubmitForm(user) {
    if (query.get("id")) {
      dispatch(
        editUserDetailsToFirebase({
          ...user,
          id: query.get("id"),
        })
      );
      return;
    }
    dispatch(createNewUserToFirebase(user));
  }
  function handleRemoveUser(id) {
    dispatch(removeUserFromFirebase(id));
  }
  useEffect(() => {
    if(!isEditting&&!isCreating){
    updateSearchParams();

    }
  }, [isEditting, isCreating]);
  function updateSearchParams() {
    if (firstRender.current) {
      firstRender.current = false;
      history.push({
        pathname: history.location.pathname,
        search: history.location.search,
      });
      return;
    }
    if (!isEditting && !isCreating) {
      history.push({
        pathname: history.location.pathname,
        search: undefined,
      });
    }
  }

  useEffect(() => {
    if (history.location.search && query.get("search") && !isLoading) {
      const filterObj = handleCreateFilterObject();
      if (userList.length > 0) {
        return dispatch(filterUserList(filterObj));
      }
    }
  }, [history.location.search, isLoading]);
  const clearFilterUrlParam = () => {
    history.push({
      pathname: history.location.pathname,
      search: "",
    });
  };
  const pushFilterListToSearchParams = (searchParamsFilterList) => {
    history.push({
      pathname: history.location.pathname,
      search: `?${searchParamsFilterList}`,
    });
  };
  function applyFilter(searchParamsFilterList) {
    const searchParamsDefault = "search=true&";
    if (searchParamsFilterList === searchParamsDefault) {
      clearFilterUrlParam();
      dispatch(clearFilteredUserList());
      return;
    }
    pushFilterListToSearchParams(searchParamsFilterList);
  }
  const checkIsLoadingToViewLoadingIcon = () => {
    return (
      !isLoading &&
      !isUserDetailsLoading &&
      !isEditting &&
      !isDeleting &&
      !isCreating
    );
  };
  return (
    <>
      {!checkIsLoadingToViewLoadingIcon() && <FormLoading />}
      <NotifyDialog message={message} error={error} />
      <div className="userPage">
        <PageTitle
          title="User"
          description="User Team"
          background={bg}
          icon={<i className="fas fa-users"></i>}
        />
        <PageContent>
          <div className="searchBarWrapper">
            <Link
              to={{
                pathname: `${history.location.pathname}`,
                search: "?form=true",
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
            rowHandlers={{
              handleRemoveUser,
              handleActiveUser,
              handleUnactiveUser,
            }}
            tablePropertyList={tablePropertyList}
            tableDataList={
              !isFiltering && filteredUserList.length <= 0
                ? userList
                : filteredUserList
            }
          />
          <PaginationBar/>
        </PageContent>
        <FormModal
          title={query.get("id") ? `Edit user ` : "Create new user"}
          isContentLoading={false}
          clearForm={clearInputForm}
          handleSetTouchedInput={handleSetTouchedInput}
          handleSubmitForm={handleSubmitCallback}
          handleOnInputChange={handleOnInputChange}
          inputList={inputList}
          history={history}
          isModalOpen={!!query.get("form")}
        />
      </div>
    </>
  );
};

export default UserPage;
