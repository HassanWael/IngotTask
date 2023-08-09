import React, { Component } from "react";
import styled from "styled-components";
import Member from "./member";

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => `${props.level * 30}px`};
  /* margin-top: 30px; */
`;

export default class FamilyTree extends Component {
  hasChildren(member) {
    return member.referrers && member.referrers.length;
  }

  render() {
    const level = this.props.level || 0;
    return (
      <>
        <StyledWrapper level={level}>
          {this.props.users.map((user, i) => {
            // Odd money / Even number
            const isEven = i % 2 === 0;
            return (
              <div key={`level-${level}-${i}`}>
                <Member {...user} />
                {this.hasChildren(user) && (
                  <FamilyTree users={user.referrers} level={level + 1} />
                )}
              </div>
            );
          })}
        </StyledWrapper>
      </>
    );
  }
}
