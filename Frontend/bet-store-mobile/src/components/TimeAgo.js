import React from "react";
import PropTypes from "prop-types";
import ReactTimeAgo from "react-time-ago";
import { Text } from "react-native";

export default function TimeAgo(props) {
  return <ReactTimeAgo {...props} component={Time} />;
}

function Time({ date, verboseDate, tooltip, children, ...rest }) {
  return <Text>{children}</Text>;
}

Time.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  verboseDate: PropTypes.string,
  tooltip: PropTypes.bool.isRequired,
  children: PropTypes.string.isRequired,
};
