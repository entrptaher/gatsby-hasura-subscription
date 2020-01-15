import React from "react";
import { useSubscription } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const SUB_AUTHORS= gql`
subscription author{
  author(order_by: {id: asc}){
    id
    name
  }
}
`;

const AuthorList = () => {
  const { data, loading, error } = useSubscription(SUB_AUTHORS, { suspend: false });
  if (loading) return "loading...";
  if (error) return `error: ${error.message}`;

  return (
    <div>
      {data.author.map((author, index) => (
        <div key={index}>
          <h2>{author.name}</h2>
        </div>
      ))}
    </div>
  );
};

export default AuthorList;