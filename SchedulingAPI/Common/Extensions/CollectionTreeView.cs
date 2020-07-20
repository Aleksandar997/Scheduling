using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace Common.Extensions
{
    public interface ITreeview<T>
    {
        int? ParentId { get; set; }
        List<T> Children { get; set; }
    }
    public static class CollectionTreeView
    {
        public static IEnumerable<T> ToTreeView<T>(this IEnumerable<T> wholeList, Expression<Func<T, int?>> identity) where T : ITreeview<T> =>
            ToTreeView(wholeList.ToList(), identity);
        public static List<T> ToTreeView<T>(this List<T> wholeList, Expression<Func<T, int?>> identity) where T : ITreeview<T>
        {
            var parents = wholeList.Where(x => x.ParentId == 0 || x.ParentId == null).ToList();
            parents.ForEach(p => wholeList.Remove(p));
            string identityId = string.Empty;
            //(identity.Body as MemberExpression).Member.Name;
            var body = identity.Body;
            switch (body.NodeType)
            {
                case ExpressionType.Constant:
                    identityId = (body as MemberExpression).Member.Name;
                    break;
                default:
                    identityId = ((body as UnaryExpression).Operand as MemberExpression).Member.Name;
                    break;
            }
            var a = BuildTreeview(wholeList, identityId, parents);
            return a;
        }
        public static List<T> BuildTreeview<T>(this List<T> wholeList, string identityId, List<T> parents = null) where T : ITreeview<T>
        {
            foreach (var parent in parents)
            {
                foreach (var child in wholeList.ToList())
                {
                    if (parent.GetType().GetProperty(identityId).GetValue(parent).ToString().Equals(child.ParentId.ToString()))
                    {
                        parent.Children.Add(child);
                        wholeList.Remove(child);
                        BuildTreeview(wholeList, identityId, new List<T>() { child });
                    }
                }
                wholeList.Remove(parent);
            }
            return parents;
        }
    }

}
