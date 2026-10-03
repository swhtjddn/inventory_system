import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../../actions";
import axios from "axios";

import RequestComponent from "../Helpers/Request";

const Request = (props) => {
  const render = () => {
    return <RequestComponent />;
  };

  return <>{!props.auth ? <Redirect to="/" /> : render()}</>;
};

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps, actions)(Request);
