using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace webapi.ViewModels
{
    public class ReportGridViewModel
    {
        public ReportGridViewModel()
        {
            Headers = new List<ReportGridHeaderViewModel>();
            Data = new List<object>();
        }
        public IEnumerable<ReportGridHeaderViewModel> Headers { get; set; }
        public IEnumerable<object> Data { get; set; }
    }
}
