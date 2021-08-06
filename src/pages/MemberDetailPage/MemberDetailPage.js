import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { NavLink, Redirect, useParams } from "react-router-dom";
import FormLoading from "../../components/FormLoading/FormLoading";
import PageContent from "../../components/PageContent/PageContent";
import {
  getMemberDetailsByIdFromFirebase,
  getSimiliarProfile,
} from "../../redux/actions/member";
import "./MemberDetailPage.css";
const MemberDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { memberDetails,error, isMemberDetailsLoading, similiarList,isLoadingSimiliarList } = useSelector(
    (state) => state.member
  );
  useEffect(() => {
    dispatch(getMemberDetailsByIdFromFirebase(id));
  }, [id]);
  useEffect(() => {
    if (memberDetails && memberDetails.team) {
      dispatch(getSimiliarProfile(memberDetails.team));
    }
  }, [isMemberDetailsLoading]);

  if(!isMemberDetailsLoading&&error==="Not found"){
    return <Redirect to="/"/>
  }
  return (
    <>
      <div className="memberDetail">
        <PageContent>
          {isMemberDetailsLoading ? (
            <FormLoading />
          ) : (
            memberDetails && (
              <>
                <div className="memberDetailHead">
                  <div className="breadCumbWrap">
                    <div className="breadCumb">
                      <NavLink to="/">Member</NavLink>
                      <i className="fas fa-chevron-right"></i>
                      <span>
                        {memberDetails.lastName + " " + memberDetails.firstName}
                      </span>
                    </div>
                    <p className="breadCumbText">Edit avatar, profile, etc</p>
                  </div>
                  <div className="connectButton">
                    <i className="fab fa-twitter"></i>
                    <button>Connect Twitter</button>
                  </div>
                </div>
                <div className="memberDetailContent">
                  <div className="avatarWrap">
                    <div className="avatarBox">
                      <img src={memberDetails.picture} alt="" />
                      <div className="avatarName">
                        <p>
                          {memberDetails.lastName +
                            " " +
                            memberDetails.firstName}
                        </p>
                      </div>
                    </div>
                    <div className="registerDate">
                      <p>Register date</p>
                      <p>
                        {memberDetails.joinedDate &&
                          memberDetails.joinedDate}
                      </p>
                    </div>
                  </div>
                  <div className="information">
                    <div className="personalInfo infoRow">
                      <div className="personalTitle">
                        <h4>Personal Infomation</h4>
                      </div>
                      <div className="info">
                        <span className="label">Name : </span>
                        <span>
                          {memberDetails.lastName +
                            " " +
                            memberDetails.firstName}
                        </span>
                      </div>
                      <div className="info">
                        <span className="label">Position : </span>
                        <span>{memberDetails.positionName}</span>
                      </div>
                      <div className="info">
                        <span className="label">Email : </span>
                        <span>{memberDetails.email}</span>
                      </div>
                      <div className="info">
                        <span className="label">Year Experience : </span>
                        <span>10 years</span>
                      </div>
                    </div>
                    <div className="aboutInfo infoRow">
                      <h4>About</h4>
                      <p>{memberDetails.about}</p>
                    </div>
                    <div className="skillInfo infoRow">
                      <h4>Skills</h4>
                      <div className="skillWrap">
                        <div className="skillItem">
                          <p>UI</p>
                        </div>
                        <div className="skillItem">
                          <p>css</p>
                        </div>
                        <div className="skillItem">
                          <p>html</p>
                        </div>
                        <div className="skillItem">
                          <p>javascript</p>
                        </div>
                        <div className="skillItem">
                          <p>python</p>
                        </div>
                        <div className="skillItem">
                          <p>reactjs</p>
                        </div>
                        <div className="skillItem">
                          <p>photoshop</p>
                        </div>
                        <div className="skillItem">
                          <p>Linux</p>
                        </div>
                        <div className="skillItem">
                          <p>UX</p>
                        </div>
                        <div className="skillItem">
                          <p>php</p>
                        </div>
                      </div>
                    </div>
                    <div className="skillInfo infoRow">
                      <h4>Language</h4>
                      <div className="skillWrap">
                        <div className="skillItem">
                          <p>France</p>
                        </div>
                        <div className="skillItem">
                          <p>English</p>
                        </div>
                        <div className="skillItem">
                          <p>Spain</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="similiarProfile">
                    <h4>Similiar Profile</h4>
                    {!isLoadingSimiliarList &&
                    similiarList
                      .filter((item) => item.id != id)
                      .map((item) => (
                        <NavLink key={item.id} to={`/member/${item.id}`} className="profileBox">
                          <img src={item.picture} alt="" />
                          <div className="profileDetail">
                            <strong>
                              {item.firstName + " " + item.lastName}
                            </strong>
                            <p>{item.positionName}</p>
                            <p>{item.teamName}</p>
                          </div>
                        </NavLink>
                      ))}
                  </div>
                </div>
              </>
            )
          )}
        </PageContent>
      </div>
    </>
  );
};

export default MemberDetailPage;
