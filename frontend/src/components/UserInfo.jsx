const UserInfo = ({ user }) => {
  return (
    <div id="user-info-container" className="p-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">User Info: </h1>
        <h1>Email: {user.email}</h1>
        <h1>Username: {user.username}</h1>
      </div>
    </div>
  );
};

export default UserInfo;
