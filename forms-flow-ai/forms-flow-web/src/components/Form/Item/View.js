import React, { useCallback, useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  selectRoot,
  resetSubmissions,
  saveSubmission,
  Form,
  selectError,
  Errors,
  getForm, Formio,
} from "react-formio";
import { push } from "connected-react-router";
import { Link, useParams } from "react-router-dom";
import Loading from "../../../containers/Loading";
import { getProcessReq } from "../../../apiManager/services/bpmServices";
import {
  setFormFailureErrorData,
  setFormRequestData,
  setFormSubmissionError,
  setFormSubmissionLoading, setFormSuccessData,
  setMaintainBPMFormPagination,
} from "../../../actions/formActions";
import SubmissionError from "../../../containers/SubmissionError";
import {
  applicationCreate,
  publicApplicationCreate,
  publicApplicationStatus,
} from "../../../apiManager/services/applicationServices";
import LoadingOverlay from "react-loading-overlay";
import { CUSTOM_EVENT_TYPE } from "../../ServiceFlow/constants/customEventTypes";
import { toast } from "react-toastify";
import {
  setFormSubmitted,
  setPublicFormStatus,
} from "../../../actions/formActions";
import { fetchFormByAlias } from "../../../apiManager/services/bpmFormServices";
import {checkIsObjectId} from "../../../apiManager/services/formatterService";
import Card from "react-bootstrap/Card";

const View = React.memo((props) => {
  const isFormSubmissionLoading = useSelector(
    (state) => state.formDelete.isFormSubmissionLoading
  );
  const isFormSubmitted = useSelector(
    (state) => state.formDelete.formSubmitted
  );
  const publicFormStatus = useSelector(
    (state) => state.formDelete.publicFormStatus
  );
  const isPublic = window.location.href.includes("public"); //need to remove
  const { formId } = useParams();

  const {
    isAuthenticated,
    submission,
    hideComponents,
    onSubmit,
    onCustomEvent,
    errors,
    options,
    form: { form, isActive, url },
  } = props;
  const dispatch = useDispatch();

  const getPublicForm = useCallback((form_id, isObjectId, formObj) => {
    dispatch(
      publicApplicationStatus(form_id, (err, res) => {
        if (isPublic) {
          if(isObjectId){
            dispatch(getForm("form", form_id));
          }
          else{
            dispatch(setFormRequestData('form',form_id,`${Formio.getProjectUrl()}/form/${form_id}`));
            dispatch(setFormSuccessData('form',formObj));
          }
          if (res && res.is_anonymous && res.status === "active") {
            dispatch(setPublicFormStatus(true));
          } else {
            dispatch(setPublicFormStatus(false));
          }
        }
      })
    );
  },[dispatch,isPublic]);

  const getFormData = useCallback( () => {
    const isObjectId = checkIsObjectId(formId);
    if (isObjectId) {
      getPublicForm(formId,isObjectId);
    } else {
      dispatch(
        fetchFormByAlias(formId, async (err, formObj) => {
          if (!err) {
            const form_id = formObj._id;
            getPublicForm(form_id,isObjectId,formObj);
          }else{
            dispatch(setFormFailureErrorData('form',err));
          }
        })
      );
    }
  },[formId,dispatch,getPublicForm])


  useEffect(() => {
    if (isPublic) {
      getFormData();
    } else {
      dispatch(setMaintainBPMFormPagination(true));
    }
  }, [isPublic, dispatch,getFormData]);

  if (isActive) {
    return (
      <div data-testid="loading-view-component">
        <Loading />
      </div>
    );
  }

  if(isFormSubmitted){
    return (
      <div className="text-center" style={{ paddingTop: '8rem' }}>
        <Card style={{ width: '60vw', marginLeft: 'auto', marginRight: 'auto', padding: '2rem' }}>
          <Card.Body>
            <Card.Title>
              <span><i className="fa fa-check-circle pb-4" style={{color: '#2e8540', fontSize: '3rem', caretColor: 'transparent' }}/></span>
              <br /><h4><b>Thank you</b></h4>
            </Card.Title>
            <Card.Text>
              Your form has been submitted. An email acknowledging service of the documents will be 
              sent to the contact email address provided. If you do not receive an email acknowledging 
              service within 1 business day, please check your junk folder.  If no confirmation is received, 
              please email <a href="mailto:aglsblitigationect@gov.bc.ca">aglsblitigationect@gov.bc.ca</a>. 
              <span style={{display:'block', paddingTop: '0.75rem'}}><b>For clarity, service is not effected until an email acknowledgment has been provided.</b></span>
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
  )}

  if (!publicFormStatus && isPublic) {
    return (
      <div className="alert alert-danger mt-4" role="alert">
        Form not available
      </div>
    );
  }

  return (
    <div className="container overflow-y-auto">
      <div className="main-header">
        <SubmissionError
          modalOpen={props.submissionError.modalOpen}
          message={props.submissionError.message}
          onConfirm={props.onConfirm}
        ></SubmissionError>
        {isAuthenticated ? (
          <Link to="/form">
            <i className="fa fa-chevron-left fa-lg" />
          </Link>
        ) : null}
        {/*   <span className="ml-3">
            <img src="/form.svg" width="30" height="30" alt="form" />
          </span>*/}
        {form.title ? (
          <h3 className="ml-3 px-3 py-4">
            {/* <span className="task-head-details">
              <i className="fa fa-wpforms" aria-hidden="true" /> &nbsp; Forms /
            </span>{" "} */}
            {form.title}
          </h3>
        ) : (
          ""
        )}
      </div>
      <Errors errors={errors} />
      <LoadingOverlay
        active={isFormSubmissionLoading}
        spinner
        text="Loading..."
        className="col-12"
      >
        <div className="ml-4 mr-4">
          <Form
            form={form}
            submission={submission}
            url={url}
            options={{ ...options }}
            hideComponents={hideComponents}
            onSubmit={(data) => {
              onSubmit(data, form._id);
            }}
            onCustomEvent={onCustomEvent}
            onError={(error) => {
              document.querySelector(".container").scrollTo(0,0);
            }}
          />
        </div>
      </LoadingOverlay>
    </div>
  );
});

const doProcessActions = (submission, ownProps) => {
  return (dispatch, getState) => {
    let user = getState().user.userDetail;
    let form = getState().form.form;
    let IsAuth = getState().user.isAuthenticated;
    dispatch(resetSubmissions("submission"));
    const data = getProcessReq(form, submission._id, "new", user);

    const isPublic = window.location.href.includes("public");

    if (isPublic) {
      // this is for anonymous
      dispatch(
        publicApplicationCreate(data, (err, res) => {
          if (!err) {
            dispatch(setFormSubmissionLoading(false));
            //toast.success("Submission Saved.");
            dispatch(setFormSubmitted(true));
          } else {
            //TO DO Update to show error message
            dispatch(setFormSubmissionLoading(false));
            toast.error("Submission failed");
            // dispatch(setFormSubmitted())
            // dispatch(push(`/public/submitted`));
          }
        })
      );
    } else {
      dispatch(
        applicationCreate(data, (err, res) => {
          if (!err) {
            if (IsAuth) {
              dispatch(setFormSubmissionLoading(false));
              dispatch(setMaintainBPMFormPagination(true));
              /*dispatch(push(`/form/${ownProps.match.params.formId}/submission/${submission._id}/edit`))*/
              //toast.success("Submission Saved.");
              dispatch(push(`/form`));
            } else {
              dispatch(setFormSubmissionLoading(false));
            }
          } else {
            //TO DO Update to show error message
            if (IsAuth) {
              dispatch(setFormSubmissionLoading(false));
              dispatch(setMaintainBPMFormPagination(true));
              //dispatch(push(`/form/${ownProps.match.params.formId}/submission/${submission._id}/edit`))
              //toast.success("Submission Saved.");
              dispatch(push(`/form`));
            } else {
              dispatch(setFormSubmissionLoading(false));
            }
          }
        })
      );
    }
  };
};

const mapStateToProps = (state) => {
  return {
    user: state.user.userDetail,
    form: selectRoot("form", state),
    isAuthenticated: state.user.isAuthenticated,
    errors: [selectError("form", state), selectError("submission", state)],
    options: {
      noAlerts: false,
      i18n: {
        en: {
          error: "Please fix the errors before submitting again.",
        },
      },
    },
    submissionError: selectRoot("formDelete", state).formSubmissionError,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSubmit: (submission, formId) => {
      dispatch(setFormSubmissionLoading(true));
      dispatch(
        saveSubmission("submission", submission, formId, (err, submission) => {
          if (!err) {
            dispatch(doProcessActions(submission, ownProps));
          } else {
            const ErrorDetails = {
              modalOpen: true,
              message: "Submission cannot be done",
            };
            toast.error("Error while Submission.");
            dispatch(setFormSubmissionLoading(false));
            dispatch(setFormSubmissionError(ErrorDetails));
          }
        })
      );
    },
    onCustomEvent: (customEvent) => {
      switch (customEvent.type) {
        case CUSTOM_EVENT_TYPE.CUSTOM_SUBMIT_DONE:
          //toast.success("Submission Saved.");
          dispatch(push(`/form`));
          break;
        case CUSTOM_EVENT_TYPE.CANCEL_SUBMISSION:
          dispatch(push(`/form`));
          break;
        default:
          return;
      }
    },
    onConfirm: () => {
      const ErrorDetails = { modalOpen: false, message: "" };
      dispatch(setFormSubmissionError(ErrorDetails));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(View);
