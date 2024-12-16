
using Ardalis.Specification;
using Olx.BLL.Entities;

namespace Olx.BLL.Specifications
{
    public static class AdminMessageSpecs 
    {
        public class GetMessagesForAdmin : Specification<AdminMessage>
        {
            public GetMessagesForAdmin(bool tracking = false) =>
                Query.Where(x=>!x.FromAdmin && !x.Deleted)
                     .AsTracking(tracking);
        }

        public class GetMessagesForUser : Specification<AdminMessage>
        {
            public GetMessagesForUser(int userId,bool tracking = false) =>
                Query.Where(x => x.FromAdmin && !x.Deleted && x.User.Id == userId)
                     .AsTracking(tracking);
        }

        public class GetById : Specification<AdminMessage>
        {
            public GetById(int id,bool tracking = false) =>
                Query.Where(x => x.Id == id  && !x.Deleted)
                     .AsTracking(tracking);
        }

        public class GetUnreadedById : Specification<AdminMessage>
        {
            public GetUnreadedById(int userId,int messageId, bool tracking = false) =>
                Query.Where(x => x.Id == messageId && x.UserId == userId && !x.Readed && !x.Deleted)
                     .AsTracking(tracking);
        }

        public class GetUnreadedByIds : Specification<AdminMessage>
        {
            public GetUnreadedByIds(int userId, IEnumerable<int> messageIds, bool tracking = false) =>
                Query.Where(x => messageIds.Contains(x.Id) && x.UserId == userId && !x.Readed && !x.Deleted)
                     .AsTracking(tracking);
        }


        public class GetDeleted : Specification<AdminMessage>
        {
            public GetDeleted(bool tracking = false) =>
                Query.Where(x => x.Deleted)
                     .AsTracking(tracking);
        }

    }
}
