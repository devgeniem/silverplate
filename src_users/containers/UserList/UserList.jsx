import React from 'react';
import uuid from 'uuid/v4';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Table, Pagination } from 'react-bootstrap';
import { translate } from 'react-i18next';
import { UserListElement, UserDeletePrompt } from '../../components';
import { usersDelete } from '../../actions/users';

@translate(['list_header'])
class UserList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      delete_show: false,
      delete_user: {},
    };

    this.changePage = this.changePage.bind(this);
    this.showDelete = this.showDelete.bind(this);
    this.hideDelete = this.hideDelete.bind(this);
    this.userDelete = this.userDelete.bind(this);
  }

  // change the user lists' current page
  changePage(page) {
    this.props.dispatch(push(`/?page=${page}`));
  }

  // show the delete user prompt
  showDelete(user) {
    // change the local ui state
    this.setState({
      delete_show: true,
      delete_user: user,
    });
  }

  // hide the delete user prompt
  hideDelete() {
    // change the local ui state
    this.setState({
      delete_show: false,
      delete_user: {},
    });
  }

  // delete the user
  userDelete() {
    // delete the user
    this.props.dispatch(usersDelete(this.state.delete_user.id));

    // hide the prompt
    this.hideDelete();
  }

  render() {
    // pagination
    const { users, page, t } = this.props;
    const perPage = 10;
    const pages = Math.ceil(users.length / perPage);
    const startOffset = (page - 1) * perPage;
    let startCount = 0;

    // show the list of users
    return (
      <div>
        <Table bordered hover responsive striped>
          <thead>
            <tr>
              <th>ID</th>
              <th>{t('username')}</th>
              <th>{t('job')}</th>
              <th>{t('edit')}</th>
              <th>{t('delete')}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => {
              if (index >= startOffset && startCount < perPage) {
                startCount += 1;
                return (
                  <UserListElement key={uuid()} user={user} showDelete={this.showDelete} />
                );
              }
              return false;
            })}
          </tbody>
        </Table>

        <Pagination
          className="users-pagination pull-right"
          bsSize="medium"
          maxButtons={10}
          first
          last
          next
          prev
          boundaryLinks
          items={pages}
          activePage={page}
          onSelect={this.changePage}
        />

        <UserDeletePrompt
          show={this.state.delete_show}
          user={this.state.delete_user}
          hideDelete={this.hideDelete}
          userDelete={this.userDelete}
        />
      </div>
    );
  }
}

UserList.propTypes = {
  dispatch: PropTypes.func.isRequired,
  users: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  t: PropTypes.func,
  page: PropTypes.number.isRequired,
};

UserList.defaultProps = {
  t: null,
};

// export the connected class
function mapStateToProps(state) {
  return {
    users: state.users,

    // https://github.com/reactjs/react-router-redux#how-do-i-access-router-state-in-a-container-component
    // react-router-redux wants you to get the url data by passing the props through a million
    // components instead of reading it directly from the state, which is basically why you
    // store the url data in the state (to have access to it)
    page: Number(state.routing.locationBeforeTransitions.query.page) || 1,
  };
}
export default connect(mapStateToProps)(UserList);
